import React, { Component } from 'react';
import { IonContent, 
          IonHeader, 
          IonPage, 
          IonTitle, 
          IonToolbar,
          IonList,
          IonItem,
          IonLabel,
          IonFab,
          IonFabButton,
          IonIcon,
          IonButton,
          IonSpinner,
          IonAlert,
          IonButtons,
          withIonLifeCycle
         } from '@ionic/react';
import './Events.css';
import { add, eye, create, trash } from 'ionicons/icons';
import axios from 'axios';
import Util from '../Util';
import DetailModal from '../components/DetailModal';
import EventFormModal from '../components/EventFormModal';
import { Plugins, AppState } from '@capacitor/core';

const { App } = Plugins;


class Events extends Component {

  state = {
    eventData:[],
    isDataLoaded:false,
    detailTitle:'',
    detailDescription:'',
    showDetailModal:false,

    showEventFormModal:false,
    title:'',
    description:'',
    editEventId:'',
    formType:'create',

    showDeleteConfirm:false,
    deleteEventId:'',
    heading:'Add Event',
    btnLabel:'Create'
  }

  props:any



  ionViewDidEnter() {
    App.addListener('backButton', (data: any) => {
      if(this.state.showEventFormModal == true){
        this.closeEventFormModal();
      }else if(this.state.showDetailModal == true){
        this.closeDetailModal();
      }else{
        App.exitApp();
      }
    });

    this.setState({
      eventData:[]
    })
    this.getEventsData();
  }

  /*********************************
   * List Event
   ********************************/

  getEventsData = () =>{
    var current = this;
    var url = new Util().getBaseUrl() + '/listEvent';
    axios({
      method:'GET',
      headers: { 'Authorization': 'Token ' + localStorage.getItem('token') },
      url
    })
    .then(function (response) {
      current.setState(
        {
          eventData:response.data,
          isDataLoaded:true
        }
      );
    })
    .catch(function (error) {
    })
    .finally(function () {
    });
  }

  /*********************************
   * Detail Event
   ********************************/

  showEventDetails = (title:string, description:string) =>{
    this.setState({
        showDetailModal:true,
        detailTitle:title,
        detailDescription:description
      });
  }

  closeDetailModal = () =>{
    this.setState({
      showDetailModal:false
    });
  }

  /*********************************
   * Add Event
   ********************************/

  addEventBtnClicked = () => {
    this.setState({
      showEventFormModal:true,
      title:'',
      description:'',
      formType:'create',
      heading:'Add Event',
      btnLabel:'Create'
    });
  }

  handleChange = (e:any) => {
    this.setState({
      [e.target.name]: e.target.value.trim()
    });
  }

  handleEventSaveBtn = (e:any) =>{
    var current = this;
    var url = '';
    var formData={
      title:this.state.title,
      description:this.state.description,
      eventId:this.state.editEventId
    };

    if(this.state.formType == 'create'){
      url = new Util().getBaseUrl() + '/addEvent';
    }else{
      url = new Util().getBaseUrl() + '/editEvent';
    }
    axios({
      method:'POST',
      headers: { 'Authorization': 'Token ' + localStorage.getItem('token') },
      data: formData,
      url
    })
    .then(function (response) {
      current.closeEventFormModal();
      current.getEventsData();
    })
    .catch(function (error) {
    })
    .finally(function () {
    }); 
  }

  closeEventFormModal = () =>{
    this.setState({
      showEventFormModal:false
    });
  }

  /*********************************
   * Edit Event
   ********************************/

  editEventDetails = (id:string, title:string, description:string) => {      
    this.setState({
      title:title, 
      description:description, 
      showEventFormModal:true, 
      formType:'edit', 
      editEventId:id,
      heading:'Edit Event',
      btnLabel:'Update'
    });
  }

  
  /*********************************
   * Delete Event
   ********************************/

  deleteEventDetails = (id:string) =>{
    this.setState({
      showDeleteConfirm:true,
      deleteEventId:id
    });
  }

  handleEventDelete = () => {
    var current = this;
    var url = new Util().getBaseUrl() + '/deleteEvent';
    axios({
      method:'POST',
      headers: { 'Authorization': 'Token ' + localStorage.getItem('token') },
      data: { eventId:this.state.deleteEventId },
      url
    })
    .then(function (response) {
      current.setState({ showDeleteConfirm: false});
      current.getEventsData();
    })
    .catch(function (error) {
    })
    .finally(function () {
    });
  }

  logoutBtnClicked = () => {
    this.setState({
      eventData:[]
    })
    localStorage.removeItem('token');
    this.props.history.push('/login');
  }


  render(){
    var eventData = this.state.eventData;
    var isDataLoaded = this.state.isDataLoaded;

    console.log(eventData);
    console.log(isDataLoaded);

    if(isDataLoaded == false && eventData.length == 0){
      return(
        <IonPage>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Events</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <div style={{ textAlign:"center", marginTop:15}}><IonSpinner /></div>
          </IonContent>
        </IonPage>
      )
      }else if(isDataLoaded == true && eventData.length == 0){
      return(
        <IonPage>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="primary">
                <IonButton color="dark" onClick={this.logoutBtnClicked} >Logout</IonButton>
              </IonButtons>
              <IonTitle>Events</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <div style={{ textAlign:"center", marginTop:15 }}>No Record found</div>

            <IonFab vertical="bottom" horizontal="end" slot="fixed">
              <IonFabButton color="dark" onClick={this.addEventBtnClicked}>
              <IonIcon icon={add} />
              </IonFabButton>
            </IonFab>
          </IonContent>

             {/* Event form Modal */}
             <EventFormModal 
                title={this.state.title}
                description={this.state.description}
                showEventFormModal={this.state.showEventFormModal}
                handleChange={ (e:any) => this.handleChange(e)}
                handleEventSaveBtn={this.handleEventSaveBtn}
                closeEventFormModal={this.closeEventFormModal}
                heading={this.state.heading}
                btnLabel={this.state.btnLabel}
              />

        </IonPage>
      )
    }else if(isDataLoaded == true && eventData.length != 0){
      return(
        <IonPage>

          <IonHeader>
            <IonToolbar>
              <IonButtons slot="primary">
                <IonButton color="dark" onClick={this.logoutBtnClicked}>Logout</IonButton>
              </IonButtons>
              <IonTitle>Events</IonTitle>
            </IonToolbar>
          </IonHeader>

          <IonContent>
            
            <IonList>
            {
              Object.keys(eventData).map((key, index) => (
              <IonItem color="transparent" key={key}>
                <IonLabel>
                  <h3>{eventData[index]['title']}</h3>
                  <p>{eventData[index]['description']}</p>
                </IonLabel>
                <IonIcon icon={eye} slot="end" onClick={(e) => this.showEventDetails(eventData[index]['title'], eventData[index]['description'])} />
                <IonIcon icon={create} slot="end" onClick={(e) => this.editEventDetails(eventData[index]['id'],eventData[index]['title'], eventData[index]['description'])} />
                <IonIcon icon={trash} slot="end" onClick={(e) => this.deleteEventDetails(eventData[index]['id'])}/>
              </IonItem>
                ) )
             }
            </IonList>

            <IonFab vertical="bottom" horizontal="end" slot="fixed">
              <IonFabButton color="dark" onClick={this.addEventBtnClicked}>
              <IonIcon icon={add} />
              </IonFabButton>
            </IonFab>

             {/* Detailed view Modal */}
             <DetailModal showDetailModal={this.state.showDetailModal} closeDetailModal={this.closeDetailModal} title={this.state.detailTitle} description={this.state.detailDescription}/>


             {/* Event form Modal */}
             <EventFormModal 
                title={this.state.title}
                description={this.state.description}
                showEventFormModal={this.state.showEventFormModal}
                handleChange={ (e:any) => this.handleChange(e)}
                handleEventSaveBtn={this.handleEventSaveBtn}
                closeEventFormModal={this.closeEventFormModal}
                heading={this.state.heading}
                btnLabel={this.state.btnLabel}
              />


         <IonAlert
          isOpen={this.state.showDeleteConfirm}
          header={'Confirm!'}
          message={'Are you sure want to delete this event?'}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'dark',
              handler: blah => {
                this.setState({
                  showDeleteConfirm:false,
                  deleteEventId:''
                });
              }
            },
            {
              text: 'Delete',
              handler: () => {
                this.handleEventDelete();
              }
            }
          ]}
         />

          </IonContent>
        </IonPage>
      )
    }    
  }
}

export default withIonLifeCycle(Events);
