import React from "react";
import { withTranslation } from "react-i18next";
import styles from "public/style/aboutUs.module.css";
import axios from "axios";
class aboutUs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            predefItems:[],
            isLoading:true
        }

    }

    componentDidMount() {
        axios.get(window.api_prefix+"/predefProductsList").then(resp=>{
            console.log(resp.data);
            this.setState({
                predefItems:resp.data,
                isLoading:false
            })
        }).catch(err=>{
            if(err.response){
             alert("ERROR");
            }
        });

    }


    render() {
    if(this.state.isLoading){
        return null;
    }

        for(let i = 0;i<this.state.predefItems.types.length;i++){
            for(let j=0;j<this.state.predefItems.filters.length;j++){
                if(this.state.predefItems.types[i].id == this.state.predefItems.filters[j].filtertypeid){
                    this.state.predefItems.filters[j].type = this.state.predefItems.types[i].name;
                }
            }
        }


        let items = [];
        for(let i=0; i<this.state.predefItems.items.length; i++){
            let item = this.state.predefItems.items[i];
            item.filters = [];
            for(let j=0; j<this.state.predefItems.filters.length; j++){
                if(this.state.predefItems.filters[j].itemid == item.id){
                    item.filters.push(this.state.predefItems.filters[j]);
                }
            }

            let specsString = "(";
            for(let v=0;v<item.filters.length;v++){
                specsString+=",   "+item.filters[v].type+" : "+item.filters[v].textvalue;
            }
            specsString+=")";
            items.push(
                <div key={i}>
                    <p>ID {item.id} {item.title} {specsString}</p>
                </div>
            );
        }

        return (
            <div style={{cursor:"text"}}>
                {items}
            </div>
        );
    }

}

export default withTranslation()(aboutUs);