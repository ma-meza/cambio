const rp = require('request-promise');
const cheerio = require('cheerio');


module.exports = function(url, cb){
    rp(url)
        .then(function(html){
            const $ = cheerio.load(html);
            
            //description
            let htmlValue = $("div[data-test-id = 'post-content']").find('div > div > p');

            let userLinkHtml = $("div[data-test-id = 'post-content']").find('div > div > div > div > div > span');
            
            let numberTrades;
            if(!userLinkHtml['0']){
                numberTrades = 0;
            }else{
                let scrapedQtyTrades = userLinkHtml['0'].children[0].data;
                if(scrapedQtyTrades == "New Account"){
                    numberTrades = 0;
                }else if(url.includes("appleswap")){
                    numberTrades = scrapedQtyTrades.split(" ")[0];
                }else{
                    //hardwareswap
                    numberTrades = scrapedQtyTrades.split(" ")[1];
                }
            }


            

            let strongP = $("div[data-test-id = 'post-content']").find('div > div > p > strong');
            let emP = $("div[data-test-id = 'post-content']").find('div > div > p > em');

            let titleValue = $("div[data-test-id = 'post-content']").find('div > div > div > h1');
            let realChildren = Object.keys(htmlValue)
                .map(function(key) {
                    return htmlValue[key];
                }).map(entry=>{
                    return entry.children;
                });
            let textsValue = [];
            for(let i=0;i<realChildren.length;i++){
                if(realChildren[i] && realChildren[i][0] && realChildren[i][0].data){
                    textsValue.push(realChildren[i][0].data);
                }
            }

            let strongChildren = Object.keys(strongP)
            .map(function(key) {
                return strongP[key];
            }).map(entry=>{
                return entry.children;
            });

            let emChildren = Object.keys(emP)
            .map(function(key) {
                return emP[key];
            }).map(entry=>{
                return entry.children;
            });

            for(let i=0;i<strongChildren.length;i++){
                if(strongChildren[i] && strongChildren[i][0] && strongChildren[i][0].data){
                    textsValue.push(strongChildren[i][0].data);
                }
            }
            for(let i=0;i<emChildren.length;i++){
                if(emChildren[i] && emChildren[i][0] && emChildren[i][0].data){
                    textsValue.push(emChildren[i][0].data);
                }
            }

            //img link
            let imgValue = $("div[data-test-id = 'post-content']").find('a');
            let hrefs = Object.keys(imgValue)
                .map(function(key) {
                    return imgValue[key];
                }).map(entry=>{
                    if(entry.attribs){
                        return entry.attribs.href;
                    }else {
                        return "";
                    }
                });
            let imageLinks = hrefs.filter(word=>word.includes("imgur"));
            if(imageLinks.length>0 && typeof imageLinks[0] != undefined){
                imgScraper(imageLinks[0], (imagesArray)=>{
                    let resultObj = {success:true, description:textsValue, images:imagesArray, title:titleValue["0"].children[0].data, numberTrades:numberTrades};
                    return cb(resultObj);
                });
            }else{
                let resultObj = {success:true, description:textsValue, images:[], title:titleValue["0"].children[0].data, numberTrades:numberTrades};
                return cb(resultObj);
            }
        })
        .catch(function(err){
            //handle error
            console.log(err);
            return cb({success:false});
        });
}


function imgScraper(url, cb){
    rp(url)
        .then(function(html){
            const $ = cheerio.load(html);

            //description
            let htmlValue = $("meta[property='og:description']");
            let htmlStructure = $.root().html();
            let splitted = htmlStructure.split("\"");
            
            let imageLinks = splitted.filter(word=>word.includes("https://") && (word.includes(".jpg") || word.includes(".jpeg")));
            let semiLinks = imageLinks.map(elem=>{
                return elem.substring(0, 25);
            });
            let uniqueIndexes = [];
            for(let i=0;i<semiLinks.length;i++){
                let sum = 0;
                let mainValue = semiLinks[i];
                for(let j=i+1;j<semiLinks.length;j++){
                    if(mainValue == semiLinks[j]){
                        sum++;
                    }
                }
                uniqueIndexes.push(i);
                i+=sum;
            }
            let properUrls = uniqueIndexes.map(value=>{
                return imageLinks[value];
            });

            return cb(properUrls);
        })
        .catch(function(err){
            //handle error
            console.log(err);
        });
}
