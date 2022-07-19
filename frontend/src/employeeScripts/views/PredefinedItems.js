import React from "react";
import { withTranslation } from "react-i18next";
import axios from "axios";
import styles from "public/style/newListing.module.css";
import queryString from "query-string";
import Spinner from "microComponents/LoaderAnimation";


class NewListing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            category: 1,
            categoryOptions: [],
            filterTypes: [],
            listingId: 0,
            listingMode: 0, //0 = new listing, 1 = edit listing, 2 = draft mode
            formError: "",
            isDataLoading: false
        }


        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFilterValueChange = this.handleFilterValueChange.bind(this);
        this.postListing = this.postListing.bind(this);
        this.fetchFilters = this.fetchFilters.bind(this);
    }

    componentDidMount() {
        let listingId;
        let listingMode;
        if (queryString.parse(window.location.search).listingid && queryString.parse(window.location.search).listingmode) {
            listingId = queryString.parse(window.location.search).listingid;
            listingMode = queryString.parse(window.location.search).listingmode;
            if (listingMode == 1 || listingMode == 2) {
                axios.get(window.api_prefix+"/listingDetails?id=" + listingId).then(resp => {
                    let listingDetails = resp.data.listingDetails;
                    let filters = resp.data.filters;
                    if (listingDetails) {
                        this.setState({
                            title: listingDetails.title,
                            category: listingDetails.categoryid,
                            listingMode: 1,
                            listingId: listingId
                        });
                        this.fetchFilters(listingDetails.categoryid, () => {
                            let currentFilters = this.state.filterTypes;
                            for (let i = 0; i < currentFilters.length; i++) {
                                for (let j = 0; j < filters.length; j++) {
                                    if (currentFilters[i].id == filters[j].filtertypeid) {
                                        if (currentFilters[i].type == 0) {
                                            currentFilters[i].userSelection = filters[j].value;
                                        } else if (currentFilters[i].type == 1) {
                                            if (filters[j].value == -1) {
                                                currentFilters[i].searchValue = filters[j].textvalue;
                                            } else {
                                                currentFilters[i].searchValue = "";
                                                let optionIndex = 0;
                                                for (let k = 0; k < currentFilters[i].options.length; k++) {
                                                    if (currentFilters[i].options[k].value == filters[j].value) {
                                                        optionIndex = k;
                                                        break;
                                                    }
                                                }
                                                currentFilters[i].searchValue = optionIndex;
                                            }
                                        } else if (currentFilters[i].type == 2) {
                                            currentFilters[i].userSelection = filters[j].value;
                                        }
                                        filters.splice(j, 1);
                                        break;
                                    }
                                }
                            }
                            this.setState({
                                filterTypes: currentFilters
                            });
                        });
                    } else {
                        this.setState({
                            listingMode: 0
                        });
                    }
                });
            } else {
                this.fetchFilters(1, null);
                this.setState({
                    listingMode: 0
                });
            }
        } else {
            this.fetchFilters(1, null);
            this.setState({
                listingMode: 0
            });
        }
        axios.get(window.api_prefix+"/allLeafCategories").then(resp => {
            this.setState({
                categoryOptions: resp.data
            });
        }).catch();
    }

    fetchFilters(value, cb) {
        axios.get(window.api_prefix+"/getFiltersFromCategoryIdForPredefinedItem?id=" + value).then(resp => {
            if (resp.data.filterValues && resp.data.filterTypes && resp.data.filterValues.length > 0 && resp.data.filterTypes.length > 0) {
                let filterTypes = resp.data.filterTypes;
                let filterValues = resp.data.filterValues;
                for (let i = 0; i < filterTypes.length; i++) {
                    filterTypes[i].options = [];
                    if (filterTypes[i].type == 0) {
                        filterTypes[i].userSelection = 0;
                    } else if (filterTypes[i].type == 1) {
                        filterTypes[i].searchValue = "";
                        filterTypes[i].userSelection = -1;
                    } if (filterTypes[i].type == 2) {
                        filterTypes[i].userSelection = 0;
                    }
                }
                for (let i = 0; i < filterValues.length; i++) {
                    for (let j = 0; j < filterTypes.length; j++) {
                        if (filterValues[i].filtertypeid == filterTypes[j].id) {
                            if (filterTypes[j].type == 1) {
                                filterTypes[j].options.push(filterValues[i]);
                                filterTypes[j].userSelection = filterTypes[j].options.length - 1;
                            }
                            break;
                        }
                    }
                }
                this.setState({
                    filterTypes: filterTypes,
                }, cb);
            } else {
                this.setState({
                    filterTypes: [],
                }, cb);
            }
        }).catch();
    }

    handleInputChange(e) {
        const { name, value } = e.target;
        if (name == "category") {
            // this.fetchFilters(value);
            this.setState({
                [name]: value
            });
        } else {
            this.setState({
                [name]: value
            });
        }
    }

    handleFilterValueChange(arrayIndex, event) {
        let allFilters = this.state.filterTypes;
        let currentFilter = allFilters[arrayIndex];
        if (currentFilter.type == 0) {
            currentFilter.userSelection = event.target.value;
        } else if (currentFilter.type == 1) {
            currentFilter.userSelection = event.target.value;
            currentFilter.searchValue = "";
        } else if (currentFilter.type == 2) {
            currentFilter.userSelection = event.target.value;
        }
        allFilters[arrayIndex] = currentFilter;
        this.setState({
            filterTypes: allFilters
        });
    }

    handleCustomFilterValueChange(arrayIndex, event) {
        let allFilters = this.state.filterTypes;
        let currentFilter = allFilters[arrayIndex];
        currentFilter.searchValue = event.target.value;
        allFilters[arrayIndex] = currentFilter;
        this.setState({
            filterTypes: allFilters
        });
    }


    postListing() {
        let filters = this.state.filterTypes;
        let title = this.state.title;
        let cat = this.state.category;

        let filtersType0 = [];
        let filtersType1Custom = [];
        let filtersType1Predefined = [];
        let filtersType2 = [];
        for (let i = 0; i < filters.length; i++) {
            if (filters[i].type == 0) {
                filtersType0.push({ id: filters[i].id, value: filters[i].userSelection });
            } else if (filters[i].type == 1) {
                if (filters[i].userSelection == -1 || filters[i].searchValue.length > 0) {
                    filtersType1Custom.push({ id: filters[i].id, searchValue: filters[i].searchValue });
                } else {
                    let value = filters[i].options[filters[i].userSelection].id;
                    filtersType1Predefined.push({ id: filters[i].id, value: value });
                }
            } else if (filters[i].type == 2) {
                filtersType2.push({ id: filters[i].id, value: filters[i].userSelection });
            }
        }

        if (title.length > 0 && title.length < 255) {
            for (let i = 0; i < filters.length; i++) {
                console.log(filters[i]);
            }

            let reqObj = { listingId: this.state.listingId, title: title, cat: cat, filtersType0: filtersType0, filtersType1Custom: filtersType1Custom, filtersType1Predefined: filtersType1Predefined, filtersType2 };
            if (this.state.listingMode == 1) {
                axios.post(window.api_prefix+"/editPredefItem", reqObj).then((resp) => {
                    alert("POSTED!");
                });
            } else {
                axios.post(window.api_prefix+"/postPredefItem", reqObj).then(resp => {
                    alert("POSTED!");
                });
            }
        } else {
            this.setState({
                formError: "Your listing title should be between 1 and 255 characters."
            });
        }
    }


    render() {
        const { t } = this.props;



        let categoriesOptions = this.state.categoryOptions.map((cat, key) => {
            return (
                <option key={key} value={cat.id}>{cat.name}</option>
            );
        });


        let filtersList;
        if (this.state.filterTypes.length > 0) {
            filtersList = this.state.filterTypes.map((filter, key) => {

                if (filter.type == 0) {
                    return (
                        <div key={key}>
                            <p className={styles.regularTextHalfMargin + " regularTextMedium"}>{filter.name}?</p>
                            <select value={filter.userSelection} onChange={this.handleFilterValueChange.bind(this, key)} className={styles.selectInput + " regularText"}>
                                <option value="0">No</option>
                                <option value="1">Yes</option>
                            </select>
                            <button onClick={() => {
                                let currentFilters = this.state.filterTypes;
                                currentFilters.splice(key, 1);
                                this.setState({
                                    filterTypes: currentFilters
                                });
                            }}>Remove</button>
                        </div>
                    );
                } else if (filter.type == 1) {
                    let options = filter.options.map((option, key) => {
                        return (
                            <option value={key} key={key}>{option.textvalue}</option>
                        );
                    });
                    let inputValue = "";
                    if (filter.searchValue.length > 0 || filter.options.length == 0) {
                        inputValue = filter.searchValue;
                    } else {
                        inputValue = filter.options[filter.userSelection].textvalue;
                    }
                    return (
                        <div key={key}>
                            <p className={styles.regularTextHalfMargin + " regularTextMedium"}>{filter.name}</p>
                            <input type="text" className={styles.textInput + " regularText"} value={inputValue} onChange={this.handleCustomFilterValueChange.bind(this, key)} ></input>
                            {
                                filter.options.length > 0 ?
                                    <select value={filter.userSelection} onChange={this.handleFilterValueChange.bind(this, key)} className={styles.selectInput + " regularText"}>
                                        {options}
                                    </select>
                                    :
                                    null
                            }
                            <button onClick={() => {
                                let currentFilters = this.state.filterTypes;
                                currentFilters.splice(key, 1);
                                this.setState({
                                    filterTypes: currentFilters
                                });
                            }}>Remove</button>
                        </div>
                    );
                } else if (filter.type == 2) {
                    return (
                        <div key={key}>
                            <p className={styles.regularTextHalfMargin + " regularTextMedium"}># {filter.name}</p>
                            <input type="number" className={styles.textInput + " regularText"} step="1" min="0" max="1000" value={filter.userSelection} onChange={this.handleFilterValueChange.bind(this, key)} ></input>
                            <button onClick={() => {
                                let currentFilters = this.state.filterTypes;
                                currentFilters.splice(key, 1);
                                this.setState({
                                    filterTypes: currentFilters
                                });
                            }}>Remove</button>
                        </div>
                    );
                }
            });
        } else {
            filtersList = null;
        }
        let pageTitle = "New listing";

        if (this.state.listingMode == 1) {
            pageTitle = "Edit listing";
        } else if (this.state.listingMode == 2) {
            pageTitle = "Publish draft listing";
        }

        return (
            <div>
                <div id={styles.topMainContainer}>
                    <div id={styles.formContainer}>
                        <p className={styles.regularText + " title1"}>{pageTitle}</p>
                        <p className={styles.regularTextHalfMargin + " regularTextMedium"}>Title</p>
                        <input className={styles.textInput + " regularText"} name="title" value={this.state.title} onChange={this.handleInputChange} type="text"></input>
                        <p className={styles.regularTextHalfMargin + " regularTextMedium"}>Category</p>
                        <select value={this.state.category} onChange={this.handleInputChange} className={styles.selectInput + " regularText"} name="category">
                            {categoriesOptions}
                        </select>
                        {filtersList}
                        <p>{this.state.formError}</p>
                        <button className={"buttonCta regularTextMedium " + styles.ctaButton} onClick={this.postListing}>List now</button>
                    </div>
                </div>

                {
                    this.state.isDataLoading == true ?
                        <Spinner />
                        :
                        null
                }
            </div>
        );
    }
}


export default withTranslation()(NewListing);
