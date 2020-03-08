import React, { Component } from 'react';
import { IonModal, IonContent, IonText, IonButton, IonHeader, IonToolbar, IonTitle } from '@ionic/react';

interface DetailModalProps { 
    showDetailModal:boolean,
    title:string,
    description:string,
    closeDetailModal:any
}

class DetailModal extends Component<DetailModalProps> {

    closeDetailModal = (event:any) => {
        this.props.closeDetailModal();
    }

    render(){
        return(
          <>
          
            <IonModal isOpen={this.props.showDetailModal}>
              <IonHeader>
                <IonToolbar>
                  <IonTitle>Event Details</IonTitle>
                </IonToolbar>
              </IonHeader>
                <IonContent fullscreen class="ion-padding">
                  <IonText>
                    <h4>{this.props.title}</h4>
                  </IonText>
                  <IonText>
                    <h6>{this.props.description}</h6>
                  </IonText>
                </IonContent>
              <IonButton color="dark" onClick={this.closeDetailModal}>Close</IonButton>
            </IonModal>
            </> 
        )
    }
}
export default DetailModal;