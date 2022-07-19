import React from "react";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import axios from "axios";
import Footer from "microComponents/Footer.js";
import styles from "public/style/search.module.css";
import DesktopTopNav from "microComponents/DesktopTopNav.js";
import MobileBottomNav from "microComponents/MobileBottomNav.js";
import queryString from "query-string";
import ActivityTicker from "microComponents/ActivityTicker";
import Modal from "microComponents/Modal";
import ListingCard from "microComponents/ListingCardSmallCard";
import MobileSearch from "../microComponents/MobileSearch";

class SearchPage extends React.Component {
    constructor() {
        super();
        this.state = {
            textualSearchValue: "...",
            category: 0,
            filters: [],
            isFiltersModalOpened: false,
            results: [],
            params: [],

            categories:[],
            isMobileSearchDisplayed:false
        }
        this.rebuildUrl = this.rebuildUrl.bind(this);
        this.searchFromUrl = this.searchFromUrl.bind(this);
    }

    componentDidMount() {
        let params = queryString.parse(window.location.search);
        if(typeof params.predefType != "undefined"){
            axios.get(window.api_prefix+"/getPredefTypeName?id=" + params.predefType).then((resp) => {
                this.setState({
                    textualSearchValue: resp.data.title
                });
            });
            this.searchFromUrl(params, false);
        }else if (typeof params.cat != 'undefined') {
            axios.get(window.api_prefix+"/getCategoryName?id=" + params.cat).then((resp) => {
                this.setState({
                    textualSearchValue: resp.data.name
                });
            });
            this.setState({
                category: params.cat,
                params: params
            });
            this.searchFromUrl(params, true)
        }
        axios.get(window.api_prefix+"/allCategories").then(res => {
            for (let i = 0; i < res.data.length; i++) {
                if (res.data[i].parentid != null) {
                    for (let j = 0; j < res.data.length; j++) {
                        if (res.data[i].parentid === res.data[j].id) {
                            if (res.data[j].children) {
                                res.data[j].children.push(res.data[i]);
                            } else {
                                res.data[j].children = [res.data[i]];
                            }
                            res.data.splice(i, 1);
                            i--;
                            break;
                        }
                    }
                }
            }
            this.setState({
                categories: res.data
            });
        }).catch();
    }



    rebuildUrl() {
        let baseUrl = window.location.pathname + "?";
        const allKeys = Object.keys(this.state.params);
        allKeys.forEach((key) => {
            if (this.state.params[key] instanceof Array) {
                for (let i = 0; i < this.state.params[key].length; i++) {
                    baseUrl += key + "=" + this.state.params[key][i] + "&";
                }
            } else {
                baseUrl += key + "=" + this.state.params[key] + "&";
            }
        });
        baseUrl = baseUrl.substring(0, baseUrl.length - 1);
        this.props.history.push(baseUrl);
        this.searchFromUrl(this.state.params, false);
    }
    valueIsPresent(elem, array) {
        let element = elem.toString();
        for (let i = 0; i < array.length; i++) {
            if (element == array[i].toString()) {
                return true;
            }
        }
        return false;
    };
    searchFromUrl(params, isCategoryProvided) {
        axios.post(window.api_prefix+"/searchResults", params).then(resp => {
            this.setState({
                results: resp.data
            });
        });
        if(isCategoryProvided){
            axios.get(window.api_prefix+"/categoriesSpecificFilters?categoryId=" + params.cat).then(resp => {
                let filterNames = resp.data.filterNames;
                let filterValues = resp.data.filterValues;
                for (let i = 0; i < filterNames.length; i++) {
                    if (filterNames[i].type == 0) {
                        //Y/N filter

                        if (typeof params[filterNames[i].id] != "undefined") {
                            filterNames[i].value = params[filterNames[i].id];
                        } else {
                            filterNames[i].value = 0;
                        }
                        continue;
                    } else if (filterNames[i].type == 1) {
                        //CUSTOM or SELECT filter
                        filterNames[i].options = [];
                        filterNames[i].value = [];
                        if (typeof params[filterNames[i].id] != "undefined") {
                            if (params[filterNames[i].id] instanceof Array) {

                                let searchOptions = params[filterNames[i].id];
                                for (let j = 0; j < filterValues.length; j++) {
                                    if (filterValues[j].filtertypeid == filterNames[i].id) {
                                        console.log(filterValues[j].value);
                                        console.log(searchOptions);
                                        if (this.valueIsPresent(filterValues[j].value, searchOptions)) {
                                            console.log("YEEE");
                                            filterNames[i].value.push(filterNames[i].options.length);
                                        }
                                        filterNames[i].options.push(filterValues[j]);
                                    }
                                }
                            } else {
                                let searchOptions = params[filterNames[i].id];
                                for (let j = 0; j < filterValues.length; j++) {
                                    if (filterValues[j].filtertypeid == filterNames[i].id) {
                                        if (searchOptions == filterValues[j].value) {
                                            filterNames[i].value.push(filterNames[i].options.length);
                                        }
                                        filterNames[i].options.push(filterValues[j]);
                                    }
                                }
                            }
                        } else {
                            for (let j = 0; j < filterValues.length; j++) {
                                if (filterValues[j].filtertypeid == filterNames[i].id) {
                                    filterNames[i].options.push(filterValues[j]);
                                }
                            }
                        }
                        console.log(filterNames[i].value);
                    } else if (filterNames[i].type == 2) {

                        //number filter
                        if (typeof params[filterNames[i].id] != "undefined") {
                            filterNames[i].value = params[filterNames[i].id];
                        } else {
                            filterNames[i].value = 0;
                        }
                    }
                }
                console.log("--- - - - -- - - ");
                console.log(filterNames);
                console.log("--- - - - -- - - ");
                this.setState({
                    filters: filterNames
                });
            });
        }
    }

    handleFilterValueChange(key, event) {
        const target = event.target;
        let currentFilters = this.state.filters;
        let params = this.state.params;
        if (currentFilters[key].type == 0) {
            currentFilters[key].value = (target.checked == true ? 1 : 0);
            params[currentFilters[key].id] = currentFilters[key].value;
        } else if (currentFilters[key].type == 2) {
            params[currentFilters[key].id] = target.value;
            currentFilters[key].value = target.value;
        }
        this.setState({
            filters: currentFilters,
            params: params
        }, this.rebuildUrl)
    }

    handleType1FilterValueChange(key1, key2, event) {
        const target = event.target;
        let params = this.state.params;
        let currentFilters = this.state.filters;
        if (currentFilters[key1].type == 1) {
            if (target.checked == true) {
                let elemIndex = currentFilters[key1].value.indexOf(key2);
                if (elemIndex == -1) {
                    currentFilters[key1].value.push(key2);
                }
            } else {
                let elemIndex = currentFilters[key1].value.indexOf(key2);
                if (elemIndex != -1) {
                    currentFilters[key1].value.splice(elemIndex, 1);
                }
            }

            let paramsType1Array = [];
            for (let k = 0; k < currentFilters[key1].value.length; k++) {
                paramsType1Array.push(currentFilters[key1].options[currentFilters[key1].value[k]].value);
            }
            params[currentFilters[key1].id] = paramsType1Array;
        }
        this.setState({
            filters: currentFilters,
            params: params
        }, this.rebuildUrl)
    }

    render() {
        let visibleFilters = [];
        // for (let i = 0; i < 2; i++) {
        //     if (this.state.filters[i]) {
        //         let filterString = "";
        //         for (let j = 0; j < this.state.filters[i].values.length; j++) {
        //             filterString += this.state.filters[i].values[j].textualValue + ", "
        //         }
        //         filterString = filterString.substring(0, filterString.length - 2);
        //         visibleFilters.push(
        //             <div key={i} className={styles.topicContainer}>
        //                 <p className={styles.regularTextNoMargin + " regularText"}>{filterString}</p>
        //             </div>
        //         );
        //     } else {
        //         break;
        //     }
        // }
        visibleFilters.push(
            <div key={"a1"} className={styles.topicContainer} onClick={() => {
                this.setState({
                    isFiltersModalOpened: true
                });
            }}>
                <p className={styles.regularTextNoMargin + " regularText"}>All filters</p>
            </div>
        );


        let filtersDiv = this.state.filters.map((filter, key) => {
            let filterName;
            if (filter.type == 0) {
                filterName = filter.name + "?";

                let value = (this.state.filters[key].value == 0 ? false : true);
                return (
                    <div key={key}>
                        <p>{filterName}</p>
                        <input checked={value} onChange={this.handleFilterValueChange.bind(this, key)} type="checkbox"></input>

                    </div>
                );
            } else if (filter.type == 1) {
                filterName = filter.name;
                if (filter.options.length > 0) {
                    let filtersType1Options = filter.options.map((option, key2) => {
                        let value = this.valueIsPresent(key2, filter.value);
                        return (
                            <div key={key + "_" + key2}>
                                <p>{option.textvalue}</p>
                                <input type="checkbox" checked={value} onChange={this.handleType1FilterValueChange.bind(this, key, key2)}></input>
                            </div>
                        );
                    });
                    return (
                        <div key={key}>
                            <p>{filterName}</p>
                            {filtersType1Options}
                        </div>
                    );
                } else {
                    return null;
                }

            } else if (filter.type == 2) {
                filterName = "#" + filter.name;
                return (
                    <div key={key}>
                        <p>{filterName}</p>
                        <input min="0" step="0.1" value={this.state.filters[key].value} onChange={this.handleFilterValueChange.bind(this, key)} type="number"></input>
                    </div >
                );
            }

        });

        let listings = this.state.results.map((listing, key) => {
            return (
                <ListingCard key={key} listing={listing} />
            );
        });

        return (
            <div>
                <div id={styles.bodyContainer}>
                    <div id={styles.topMainContainer}>
                        <div id={styles.topBar}>
                            <div id={styles.topBarTopContainer}>
                                <div onClick={()=>{this.setState({isMobileSearchDisplayed:true})}} id={styles.mobileSearchContainer}>
                                    <img src={"https://staticassets2020.s3.amazonaws.com/octiconsSvg/search.svg"} />
                                    <p className={"title2"}>{this.state.textualSearchValue}</p>
                                </div>
                                <p onClick={()=>{this.setState({isMobileSearchDisplayed:true})}} className={styles.regularText + " title1 "+styles.hideMobile}>{this.state.textualSearchValue}<span className={"regularText"}>{" (" + this.state.results.length + " results)"}</span></p><p className={styles.regularText + " regularText "+styles.hideDesktop}>{" (" + this.state.results.length + " results)"}</p>
                            </div>
                            {/* <div id={styles.topBarBottomContainer}>
                                {visibleFilters}
                            </div> */}
                        </div>
                        <div className={styles.separatorLine}></div>
                        <div id={styles.resultsContainer}>
                            {listings}
                        </div>
                    </div>
                </div>


                <Footer />
                <MobileBottomNav {...this.props} />
                <DesktopTopNav key={new Date().getTime()} {...this.props} />
                <ActivityTicker />

                {this.state.isMobileSearchDisplayed == true? <MobileSearch history={this.props.history} closeSearch = {()=>{this.setState({isMobileSearchDisplayed:false})}} categories={this.state.categories} />:null}


                {/* <Modal title="Filters" closeModal={() => {
                    this.setState({
                        isFiltersModalOpened: false
                    })
                }} show={this.state.isFiltersModalOpened}>
                    {filtersDiv}
                </Modal> */}
            </div>
        );
    }
}

export default SearchPage;