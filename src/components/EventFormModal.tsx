import React, { Component } from 'react';
import { IonModal, IonContent, IonText, IonButton, IonGrid, IonRow, IonCol, IonList, IonItem, IonLabel, IonInput, IonTextarea, IonHeader, IonToolbar, IonTitle, IonToast } from '@ionic/react';

interface EventFormModalProps { 
    showEventFormModal:boolean,
    handleChange:any
    handleEventSaveBtn:any
    closeEventFormModal:any
    title:string
    description:string
    heading:string
    btnLabel:string
}

class EventFormModal extends Component<EventFormModalProps> {

    state={
        toastMsg:'',
        showToast:false,
        title:'',
        description:''
    }

    handleChange = (event:any) => {
        this.props.handleChange(event);
    }

    handleEventSaveBtn = (event:any) => {
        if(this.handleValidation()){
            this.props.handleEventSaveBtn();
        }
    }

    closeEventFormModal = (event:any) => {
        this.props.closeEventFormModal();
    }


    handleValidation(){
        this.setState({ toastMsg: '',showToast:false });
        let formIsValid = true;
    
        if(!this.props.title){
        formIsValid = false;
        this.setState({ toastMsg: 'Title cannot be empty', showToast:true });
        return false;
        }
    
        if(!this.props.description){
        formIsValid = false;
        this.setState({ toastMsg: 'Description cannot be empty', showToast:true });
        return false;
        }
        return formIsValid;
    }

    render(){

        var showToast = this.state.showToast;
        var toastMsg = this.state.toastMsg;
        return(
            <IonModal isOpen={this.props.showEventFormModal}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>{this.props.heading}</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen class="ion-padding">
                  <IonGrid>
                  <IonRow>
                    <IonCol>
                    <IonList>
                        <IonItem>
                            <IonLabel position="floating">Title</IonLabel>
                            <IonInput type="text" name="title" value={this.props.title} onIonChange={this.handleChange}></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel position="floating">Description</IonLabel>
                            <IonTextarea name="description" value={this.props.description} onIonChange={this.handleChange} ></IonTextarea>
                        </IonItem>
                        <IonButton expand="block" color="dark" style={{ marginTop:'10%'}} onClick={this.handleEventSaveBtn}>{this.props.btnLabel}</IonButton>
                        <IonButton expand="block" color="dark" style={{ marginTop:'10%'}} onClick={this.closeEventFormModal}>Cancel</IonButton>
                        {/* <div style={{ textAlign:"center", marginTop:15, display:isLoginProcessing ? 'block' : 'none'}}><IonSpinner /></div> */}
                    </IonList>
                    </IonCol>
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
            </IonModal> 
        )
    }
}
export default EventFormModal;