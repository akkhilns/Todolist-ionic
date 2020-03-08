import React, { Component } from 'react';
import { IonHeader, 
        IonToolbar, 
        IonGrid, 
        IonRow, 
        IonCol, 
        IonButton,
        IonTitle, 
        IonPage, 
        IonInput, 
        IonItem, 
        IonLabel, 
        IonContent, 
        IonSpinner,
        IonToast,
        IonList, 
        withIonLifeCycle,
        IonButtons} from '@ionic/react';
import './Login.css';
import axios from 'axios';
import Util from '../Util';
import { Plugins, AppState } from '@capacitor/core';

const { App } = Plugins;


class Login extends Component {

  state = {
    email: '',
    password: '',
    showToast: false,
    toastMsg:'',
    isLoginProcessing:false
  }
  props:any


  ionViewDidEnter() {
    App.addListener('backButton', (data: any) => {
      App.exitApp();
    });
  }

 handleChange = (e:any) => {
    this.setState({
        [e.target.name]: e.target.value.trim()
    });
 }

 handleValidation(){
  this.setState({ toastMsg: '',showToast:false });
  let formIsValid = true;

  if(!this.state.email){
     formIsValid = false;
     this.setState({ toastMsg: 'Email Id cannot be empty', showToast:true });
     return false;
  }

  if(typeof this.state.email !== "undefined"){
    let lastAtPosition = this.state.email.lastIndexOf('@');
    let lastDotPosition = this.state.email.lastIndexOf('.');
    if (!(lastAtPosition < lastDotPosition && lastAtPosition > 0 && this.state.email.indexOf('@@') == -1 && lastDotPosition > 2 && (this.state.email.length - lastDotPosition) > 2)) {
       formIsValid = false;
       this.setState({ toastMsg: 'Invalid Email Id', showToast:true });
       return false;
     }
  } 

  if(!this.state.password){
    formIsValid = false;
    this.setState({ toastMsg: 'Password cannot be empty', showToast:true });
    return false;
  }
  return formIsValid;
}


 handleLoginBtn = () => {
   if(this.handleValidation()){ 
    this.setState({ toastMsg: '',showToast:false, isLoginProcessing:true });
      let current = this;
      let formData={
        username:'',
        password:''
      }
      formData['username'] = this.state.email;
      formData['password'] = this.state.password;
      var url = new Util().getBaseUrl() + '/login';
      axios({ method:'POST', data:formData, url:url})
      .then(function (response:any) {
        current.setState({ isLoginProcessing:false });
        localStorage.setItem('token', response.data.token);
        current.props.history.push("/events");
      })
      .catch(function (error:any) {
        current.setState({ toastMsg: 'Invalid Email/Password',showToast:true, isLoginProcessing:false });
      })
      .finally(function () {
      }); 
  }
 }

render(){
  const { email, showToast, toastMsg, isLoginProcessing  } = this.state;
  return (
    <>
    <IonPage>
      {/* <IonToolbar>
        <IonButtons slot="primary">
          <IonButton color="primary" >SignUp</IonButton>
        </IonButtons>
      </IonToolbar> */}
      <IonContent>
          

      <IonGrid style={{ position:'absolute', width:'100%', top:'10%'}}>
      
      <IonRow>
        <IonCol size="1"></IonCol>
        <IonCol size="10" style={{ textAlign:"center"}}><h1>Login</h1></IonCol>
        <IonCol size="1"></IonCol>
        </IonRow>

      <IonRow>
        <IonCol size="1"></IonCol>

        <IonCol size="10">
          <IonList>
              <IonItem>
                  <IonLabel position="floating">Email</IonLabel>
                  <IonInput name="email" onIonChange={this.handleChange}></IonInput>
              </IonItem>

              <IonItem>
                  <IonLabel position="floating">Password</IonLabel>
                  <IonInput type="password" name="password" onIonChange={this.handleChange} ></IonInput>
              </IonItem>
              <IonButton expand="block" color="dark" style={{ marginTop:'10%'}} onClick={this.handleLoginBtn}>Login</IonButton>
              <IonButton expand="block" color="dark" style={{ marginTop:'10%'}} onClick={() => this.props.history.push('/signup') } >Signup</IonButton>
              <div style={{ textAlign:"center", marginTop:15, display:isLoginProcessing ? 'block' : 'none'}}><IonSpinner /></div>
          </IonList>
        </IonCol>

        <IonCol size="1"></IonCol>
        
      </IonRow>

      
    </IonGrid>
    <IonToast 
        isOpen={showToast}
        message={toastMsg}
        onDidDismiss={ () => this.setState({ showToast:false, toastMsg:''})}
        duration={600}
        animated={true}
        color="danger"
      />
      </IonContent>
    </IonPage>
    </>
  )
}
}

export default withIonLifeCycle(Login);
