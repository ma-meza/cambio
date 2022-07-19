
import React from "react"
import axios from 'axios'
import { BraintreeDropIn } from "braintree-web-react"
 
class App extends React.Component {
  state = {
    clientToken: null,
    serverPaymentStatus:-1, //-1 = pending, 0 = success, 1 = error
    serverMessage:""
  };
 
  instance;
 
  async componentDidMount() {
    // Get client token for braintree authorization from your server
   const response = await axios.get(window.api_prefix+'/braintree-getToken');
   console.log(response);
    const clientToken = response.data.clientToken;
 
    this.setState({ clientToken});
  }
 
  async purchase() {
      this.setState({
          serverMessage:"",
          serverStatus:-1
      });
    // Send nonce to your server
    const { nonce } = await this.instance.requestPaymentMethod();
    axios.post(window.api_prefix+'/braintree-checkout', { nonce: nonce }).then(resp=>{
        console.log(resp);
        let serverStatus = -1;
        let serverMessage = "";
        if(resp.data.success == true){
            serverStatus = 0;
        }else{
            serverStatus = 1;
            serverMessage = resp.data.message;
        } 
        this.setState({
            serverPaymentStatus:serverStatus,
            serverMessage:serverMessage
        });
    }).catch(err=>{
        console.log(err.response);
    });
  }
 
  render() {
    if (!this.state.clientToken) {
      return (
        <div>
          <h1>Loading...</h1>
        </div>
      );
    } else {
        let errorMessage;
        if(this.state.serverPaymentStatus == 1){
            errorMessage = <p>{this.state.serverMessage}</p>
        }
      return (
        <div>
          <BraintreeDropIn
            options={{ authorization: this.state.clientToken }}
            onInstance={instance => (this.instance = instance)}
          />
          {errorMessage}
          <button onClick={this.purchase.bind(this)}>Submit</button>
        </div>
      );
    }
  }
}

export default App;