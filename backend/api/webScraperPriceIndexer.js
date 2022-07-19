const rp = require('request-promise');
const cheerio = require('cheerio');
const axios = require("axios");

module.exports = function(url, cb){
    axios.get(url).then(async resp=>{
        let listingsId = resp.data.data.map(entry=>{
            return entry.id;
        });
        let listingsBody = listingsId.map(id=>
            axios.get("https://www.reddit.com/comments/"+id+"/.json").then(({data})=>data)
        );
        let bodyResults = await Promise.all(listingsBody);
        let realResults = [];
        for(let i=0;i<bodyResults.length;i++){
            for(let j=0;j<bodyResults[i].length;j++){
                if(bodyResults[i][j].data.children[0] && bodyResults[i][j].data.children[0].kind && bodyResults[i][j].data.children[0].kind == "t3" && bodyResults[i][j].data.children[0].data){
                    if(bodyResults[i][j].data.children[0].data.selftext != "[removed]" && bodyResults[i][j].data.children[0].data.selftext != "[deleted]"){


                        let pricesValues = [];
                        let split = bodyResults[i][j].data.children[0].data.selftext.split(" ");
                        for(let j=0;j<split.length;j++){
                            if(split[j].includes("$")){
                                pricesValues.push(split[j]);
                            }
                        }
                        let productPrice = 0;
                        if(pricesValues.length>1 || pricesValues.length == 0){
                            productPrice = null;
                        }else{
                            //check price
                            let substring = pricesValues[0];
                            for(let i=0;i<substring.length;i++){
                                if(['.',',','1','2','3','4','5','6','7','8','9','0'].indexOf(substring.charAt(i)) == -1){
                                    substring = substring.removeCharAt(i);
                                    i--;
                                }
                                if(i==substring.length-1 && (substring.charAt(i) == '.' || substring.charAt(i) == ",")){
                                    substring = substring.substring(0, substring.length-1);
                                }
                            }
                            productPrice = substring;
                        }

                        realResults.push({description:bodyResults[i][j].data.children[0].data.selftext, price:productPrice, pricesValues, stringCombinations:stringCombi(split)});
                    }
                }
            }
        }
        return cb({success:true, listings:realResults});
    });
}


String.prototype.removeCharAt = function (i) {
    var tmp = this.split(''); // convert to an array
    tmp.splice(i , 1); // remove 1 element from the array (adjusting for non-zero-indexed counts)
    return tmp.join(''); // reconstruct the string
}

function stringCombi(sArray){  
    let wordsArray = [];
    for (var i = 0; i < sArray.length; i++) {
      for (var j = 0; j <= i; j++) {
        wordsArray.push(sArray .slice(j, sArray.length - i + j).join(' '));
      }
    }
    return wordsArray;
}