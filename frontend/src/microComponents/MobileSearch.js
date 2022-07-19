import React from "react";
import styles from "../public/style/mobileSearch.module.css";
import {Link} from "react-router-dom";
import axios from "axios";

class MobileSearch extends React.Component{
    constructor() {
        super();
        this.state = {
            categories:[],
            searchInput: "",
            searchSuggestions: [],
            showSearchSuggestion: false,
            categoryCurrentParentId: -1,
        }

        this.handleInputChange = this.handleInputChange.bind(this);

        this.searchContainerRef = React.createRef();
    }

    componentDidMount(){
        if(this.props.categories){
            this.setState({
                categories:this.props.categories
            })
        }
        this.searchInputRef.focus();
        document.body.style.overflow = "hidden";
    }
    componentWillUnmount(){
        document.body.style.overflow = "auto";
    }

    postCatTrend(catId) {
        axios.post(window.api_prefix+"/categorySearchClick", { catId: catId });
    }

    handleInputChange(e) {
        const { name, value } = e.target;

        this.setState({
            [name]: value
        });

        if (name === "searchInput") {
            if (value.length == 0) {
                this.setState({
                    searchSuggestions: [],
                    showSearchSuggestion:false
                });
            } else {
                axios.get(window.api_prefix+"/searchQuerySuggest?q="+value).then(resp=>{
                    this.setState({
                        searchSuggestions: resp.data,
                        showSearchSuggestion:true
                    });
                }).catch(err=>{
                    if(err.response){
                        this.setState({
                            searchSuggestions: [],
                            showSearchSuggestion:true
                        });
                    }
                });
            }
        }
    }

    render(){


        let searchSuggestArray = [];
        let searchSuggest;

        if (this.state.searchInput.length > 0 && this.state.showSearchSuggestion) {
            if (this.state.searchSuggestions.categories.length > 0 || this.state.searchSuggestions.predefItems.length >0) {

                let nbCategories = this.state.searchSuggestions.categories.length;
                for (let i = 0; i < this.state.searchSuggestions.predefItems.length && nbCategories+i <= 6; i++) {
                    searchSuggestArray.push(
                        <p onClick={()=>{this.props.history.push("/search?predefType="+this.state.searchSuggestions.predefItems[i].id); this.props.history.go();}} className={styles.searchSuggestP+" regularText"} key={i + "_-1"}>{this.state.searchSuggestions.predefItems[i].title}</p>
                    );
                }
                for(let i = 0; i < nbCategories; i++){
                    searchSuggestArray.push(
                        <p onClick={()=>{this.props.history.push("/search?cat="+this.state.searchSuggestions.categories[i].id); this.props.history.go();}} className={styles.searchSuggestP+" regularText"} key={i + "_-2"}>{this.state.searchSuggestions.categories[i].name}</p>
                    );
                }


                searchSuggest = (
                    <div>
                        <div ref={this.searchSuggestModalRef} className={styles.searchSuggestMainContainer}>
                            {searchSuggestArray}
                        </div>
                    </div>
                );
            } else {
                searchSuggest = (
                    <div ref={this.searchSuggestModalRef} className={styles.searchSuggestMainContainer}>
                        <p className={styles.searchSuggestP + " regularText"}>No results</p>
                    </div>
                );
            }
        } else {
            let categoriesList;
            if (this.state.categoryCurrentParentId == -1) {
                let seeMoreDiv;
                let catQtity = 0;
                categoriesList = [];
                for (let j = 0; j < this.state.categories.length; j++) {
                    let cat = this.state.categories[j];
                    catQtity++;
                    if (cat.children) {
                        categoriesList.push(
                            <p className={styles.searchSuggestP + " regularText"} onClick={() => { this.setState({ categoryCurrentParentId: cat.id }) }} key={j}>{cat.name} <img className={styles.chevronImgCategories} src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/chevron-right.svg" /></p>
                        );
                    } else {
                        categoriesList.push(
                            <p key={j} onClick={()=>{this.postCatTrend(cat.id); this.props.history.push("/search?cat=" + cat.id); this.props.history.go();}} className={styles.searchSuggestP + " regularText"} >{cat.name}</p>
                        );
                    }
                }
                // if (2 == 2) {
                //   seeMoreDiv = (
                //     <div id={styles.seeMoreCats}>
                //       <p className={styles.regularTextNoMargin + " regularText"} onClick={() => { this.setState({ isCategoriesModalDisplayed: true }); }}>See more</p>
                //     </div>
                //   );
                // }
                searchSuggest = (
                    <div>
                        <div ref={this.searchSuggestModalRef} className={styles.searchSuggestMainContainer}>
                            <p className={styles.regularTextNoMargin + " regularTextBold"}>Categories</p>
                            {categoriesList}
                        </div>
                        {seeMoreDiv}
                    </div>
                );
            } else {
                let seeMoreDiv;
                for (let i = 0; i < this.state.categories.length; i++) {
                    if (this.state.categories[i].id === this.state.categoryCurrentParentId) {
                        let parentCategoryName = this.state.categories[i].name;
                        let catQtity = 0;
                        categoriesList = this.state.categories[i].children.map((cat, key) => {
                            catQtity++;
                            return (
                                <p key={key} onClick={()=>{this.postCatTrend(cat.id); this.props.history.push("/search?cat=" + cat.id); this.props.history.go();}} className={styles.searchSuggestP + " regularText"} >{cat.name}</p>
                            );
                        });
                        categoriesList.push(
                            <p key={"cat_all"} onClick={()=>{this.postCatTrend(this.state.categoryCurrentParentId); this.props.history.push("/search?cat=" + this.state.categoryCurrentParentId); this.props.history.go();}} className={styles.searchSuggestP + " regularText"} >See all {parentCategoryName}</p>
                        );
                        if (catQtity * 50 > (window.innerHeight - 365)) {
                            seeMoreDiv = (
                                <div id={styles.seeMoreCats} onClick={() => { this.setState({ isCategoriesModalDisplayed: true }); }}>
                                    <p className={styles.regularTextNoMargin + " regularText"}>See more</p>
                                </div>
                            );
                        }
                        searchSuggest = (
                            <div>
                                <div ref={this.searchSuggestModalRef} className={styles.searchSuggestMainContainer}>
                                    <p className={styles.regularTextNoMargin + " regularTextBold " + styles.clickable} onClick={() => { this.setState({ categoryCurrentParentId: -1 }) }}><img className={styles.chevronImgCategories + " " + styles.bottomAlignChevron} src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/chevron-left.svg" /> {parentCategoryName}</p>
                                    {categoriesList}
                                </div>
                                {seeMoreDiv}
                            </div>
                        );
                        break;
                    }
                }
            }
        }



        return (
            <div id={styles.searchTransparentContainer} className={styles.searchContainerVisible}>
                <div id={styles.searchMainContainer}>
                    <div id={styles.searchTopContainer}>
                        <p className={styles.regularText + " regularTextBold"}>Search</p>
                        <img onClick={() => {this.props.closeSearch()}} id={styles.searchXImg} src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/x.svg" />
                        <div id={styles.searchInputDiv}>
                            <img id={styles.iconTopMobileNav} src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/search-grey.svg" />
                            <input ref={(input) => { this.searchInputRef = input; }}  id={styles.searchInput} value={this.state.searchInput} name="searchInput" onChange={this.handleInputChange} placeholder="Search pre-owned electronics" className={"regularText"} type="text"></input>
                        </div>
                    </div>
                    <div id={styles.searchSuggestScroller}>
                        {searchSuggest}
                    </div>
                </div>
            </div>
        );
    }
}

export default MobileSearch;

