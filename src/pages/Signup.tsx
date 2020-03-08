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
        IonButtons} from '@ionic/react';
import './Login.css';
import axios from 'axios';
import Util from '../Util';


class Signup extends Component {

  state = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    showToast: false,
    toastMsg:'',
    isSignupProcessing:false,
    toastVarient:'danger'
  }
  props:any



 handleChange = (e:any) => {
    this.setState({
        [e.target.name]: e.target.value.trim()
    });
 }

 handleValidation(){
  this.setState({ toastMsg: '',showToast:false, toastVarient:'danger' });
  let formIsValid = true;

  if(!this.state.firstName){
     formIsValid = false;
     this.setState({ toastMsg: 'First Name cannot be empty', showToast:true });
     return false;
  }

  if(!this.state.lastName){
    formIsValid = false;
    this.setState({ toastMsg: 'Last Name cannot be empty', showToast:true });
    return false;
  }

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


handleSignupBtn = () => {
   if(this.handleValidation()){ 
    this.setState({ toastMsg: '',showToast:false, isSignupProcessing:true });
      let current = this;
      let formData={
        first_name:this.state.firstName,
        last_name:this.state.lastName,
        email:this.state.email,
        password:this.state.password
      }
      var url = new Util().getBaseUrl() + '/signup';
      axios({ method:'POST', data:formData, url:url})
      .then(function (response:any) {
        current.setState(
          { isSignupProcessing:false, 
            showToast:true, 
            toastMsg: 'User created successfully', 
            toastVarient:'success',
            email: '',
            password: '',
            firstName: '',
            lastName: '',
          });
      })
      .catch(function (error:any) {
        current.setState({ 
          toastMsg: 'Email id already exist',
          showToast:true, 
          toastVarient:'danger', 
          isSignupProcessing:false,
          email: '',
          password: '',
          firstName: '',
          lastName: '',
        });
      })
      .finally(function () {
      }); 
  }
 }

render(){
  const { email, showToast, toastMsg, isSignupProcessing, toastVarient  } = this.state;
  return (
    <>
    <IonPage>
      <IonToolbar>
        <IonButtons slot="primary">
          <IonButton color="dark" onClick={() => this.props.history.push('/login') }>Login</IonButton>
        </IonButtons>
      </IonToolbar>
      <IonContent>
          

      <IonGrid style={{ position:'absolute', width:'100%', top:'7%'}}>
      
      <IonRow>
        <IonCol size="1"></IonCol>
        <IonCol size="10" style={{ textAlign:"center"}}><h3>Signup</h3></IonCol>
        <IonCol size="1"></IonCol>
        </IonRow>

      <IonRow>
        <IonCol size="1"></IonCol>

        <IonCol size="10">
          <IonList>
              <IonItem>
                  <IonLabel position="floating">First Name</IonLabel>
                  <IonInput name="firstName" value={this.state.firstName} onIonChange={this.handleChange}></IonInput>
              </IonItem>

              <IonItem>
                  <IonLabel position="floating">Last Name</IonLabel>
                  <IonInput name="lastName" value={this.state.lastName} onIonChange={this.handleChange}></IonInput>
              </IonItem>

              <IonItem>
                  <IonLabel position="floating">Email</IonLabel>
                  <IonInput name="email" value={this.state.email} onIonChange={this.handleChange}></IonInput>
              </IonItem>

              <IonItem>
                  <IonLabel position="floating">Password</IonLabel>
                  <IonInput type="password" value={this.state.password} name="password" onIonChange={this.handleChange} ></IonInput>
              </IonItem>
              <IonButton expand="block" color="dark" style={{ marginTop:'10%'}} onClick={this.handleSignupBtn}>Signup</IonButton>
              <div style={{ textAlign:"center", marginTop:15, display:isSignupProcessing ? 'block' : 'none'}}><IonSpinner /></div>
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
        color={toastVarient}
      />
      </IonContent>
    </IonPage>
    </>
  )
}
}

export default Signup;
