import React, { Component } from "react";
import {
  Container,
  Header,
  Title,
  Content,
  Text,
  Button,
  Icon,
  Footer,
  FooterTab,
  Left,
  Right,
  List,
  ListItem,
  Body,
  Fab,
  Form, Item, Input, Label, Thumbnail, Switch, Badge
} from "native-base";
import { FlatList, TouchableHighlight, Modal, View, TouchableOpacity } from "react-native";
import { Col, Row, Grid } from 'react-native-easy-grid';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
//https://github.com/wix/react-native-calendars

import styles from "./styles";



class AppointmentCalender extends Component {
  constructor() {
    super();
    this.state = {
      filterActive: false,
      isLoading: false,
      active: false,
      isDateTimePickerVisible: false,
      addActive: true,
      searchActive: true,
      data: {},
      stickyHeaderIndices: [],
      searchName: '',
      searchMobileNumber: ''
    };
    
  }


  const

  fetchAppointment() {
    this.setState({ isLoading: true });
    fetch('http://103.227.177.38:8888/app/allappointments?name=all')
      .then((response) => response.json())
      .then((responseJson) => {
        if (!this.isCancelled) { 
          var _appointmentDates={};
          responseJson.forEach(element => { 
            var date=Moment(element['appointmentDate']).format('YYYY-MM-DD');
             _appointmentDates[date]={ selected: true, marked: true, selectedColor: 'blue'}; 
          });

          this.setState({ data: _appointmentDates });
          this.setState({ isLoading: false });
        }

      })
      .catch((error) => {
        if (!this.isCancelled) {
          this.setState({ isLoading: false }); 
        }
        console.error(error);
      });
  }
  componentDidMount() {
    this.fetchAppointment();
  }

  render() {
    return (

      <Container style={styles.container}>

        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate("DrawerOpen")}
            >
              <Icon name="ios-menu" />
            </Button>
          </Left>
          <Body>
            <Title>Calender</Title>
          </Body>
        </Header>
        <Content padder>
        <Spinner visible={this.state.isLoading} textContent={"Loading Events "} textStyle={{ color: 'green',fontWeight:'bold' }} />
          
          <Calendar 
          onDayPress={(day) => {alert('selected day:'+ JSON.stringify(day))}} 
          markedDates={this.state.data} />

          

          
          
          

        </Content>
      </Container>

    );
  }
}

export default AppointmentCalender;




