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

import styles from "./styles";

class AppointmentsToday extends Component {
  constructor() {
    super();
    this.state = {
      filterActive: false,
      isLoading: false,
      active: false,
      isDateTimePickerVisible: false,
      addActive: true,
      searchActive: true,
      data: [],
      stickyHeaderIndices: [],
      searchName: '',
      searchMobileNumber: ''
    }; 
  }

  fetchAppointment() {
    var start = new Date();
    start.setHours(0, 0, 0, 0);
    var end = new Date();
    end.setHours(23, 59, 59, 999);

    this.setState({ isLoading: true });
    fetch('http://103.227.177.38:8888/app/allappointments?startDate=' + start.getTime() + '&endDate=' + end.getTime())
      .then((response) => response.json())
      .then((responseJson) => {
        if (!this.isCancelled) {
          this.setState({ data: responseJson });
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

  updateAppointment() {
    var _appointmentDate = new Date(this.state.date).getTime();
    var obj = { name: this.state.nameOfPatient, mobileNumber: this.state.mobileNumber, appointmentDate: _appointmentDate }
    alert(_appointmentDate)
    this.setState({ isLoading: true });
    fetch('http://103.227.177.38:8888/app/addorupdateappointment', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
 
    })
      .then((response) => response.json())
      .then((responseJson) => {
        // //alert("bien");
        // //alert(responseJson);
        this.fetchAppointment();
        if (!this.isCancelled) {
          this.setState({ isLoading: false });
        }
      })
      .catch((error) => {
        // //alert('error'+error); 
        this.fetchAppointment();
        if (!this.isCancelled) {
          this.setState({ isLoading: false });
        }
      });

  }
  updateAppointment1() {
    var obj = { name: this.state.nameOfPatient, mobileNumber: this.state.mobileNumber, appointmentDate: this.state.date }
    this.setState({ isLoading: true });
    var url = 'http://103.227.177.38:8888/app/allappointments?id=z';
    if (this.state.nameOfPatient != undefined) {
      url = url + '&name=' + this.state.nameOfPatient
    }
    if (this.state.mobileNumber != undefined) {
      url = url + '&mobileNumber=' + this.state.mobileNumber
    }
    if (this.state.date != undefined) {
      var startDate = new Date(this.state.date).getTime();
      url = url + '&startDate=' + startDate + '&endDate=2690829278000'
    }

    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        if (!this.isCancelled) {
          this.setState({ data: responseJson });
          this.setState({ isLoading: false });
        }

      })
      .catch((error) => {
        if (!this.isCancelled) {
          this.setState({ isLoading: false });
        }
        console.error(error);
      });
    this._hideModal();


  }
  deleteAppointment(id) {
    this.setState({ isLoading: true });
    fetch('http://103.227.177.38:8888/app/deleteappointment?id=' + id)
      .then((response) => response.json())
      .then((responseJson) => {

        this.fetchAppointment();
        if (!this.isCancelled) {
          this.setState({ isLoading: false });
        }
      })
      .catch((error) => {
        this.fetchAppointment();
        if (!this.isCancelled) {
          this.setState({ isLoading: false });
        }
      });
  }
  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
  _hideModal = () => this.setState({ active: false });

  addAppointment = () => {
    this.updateAppointment();
    this._hideModal();
  };
  searchAppointment = () => {
    this.updateAppointment1();

  };
  _handleDatePicked = (date) => {
    var year = date.getFullYear();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var dateSelected = Moment(date).format('YYYY-MM-DD HH:mm:ss');

    var selDate = dateSelected;
    this.setState({ dateTime: selDate });
    this.setState({ date: date });
    this._hideDateTimePicker();
  };
  openAppointmentAddModal = () => {
    this.setState({ active: !this.state.active })
    this.setState({ searchActive: false })
    this.setState({ addActive: true })
  }
  openAppointmentSearchModal = () => {
    this.setState({ active: !this.state.active })
    this.setState({ searchActive: true })
    this.setState({ addActive: false })
  }

  _handleDatePickedOfSearch = (date) => {
    var dateSelected = Moment(date).format('YYYY-MM-DD HH:mm:ss');
    this.setState({ searchDateTime: date });
    this._hideDateTimePicker();
  };
  componentWillMount() {
    var arr = [];
    this.state.data.map(obj => {
      if (obj.header) {
        arr.push(this.state.data.indexOf(obj));
      }
    });
    arr.push(0);
    this.setState({
      stickyHeaderIndices: arr
    });
  }
  componentWillUnmount() {
    this.isCancelled = true;
  }
  componentDidMount() {
    this.fetchAppointment();
  }
  renderItem = ({ item }) => {
    return (
      <ListItem iconRight>

        <Body>
          <Text>{item.name}</Text>
          <Text note>{Moment(item.appointmentDate).format('YYYY-MM-DD HH:mm:ss')}</Text>
          <Badge style={{ backgroundColor: "green" }}><Text>{item.mobileNumber}</Text></Badge>
        </Body>

        <Right>
          <Button style={{ backgroundColor: "red" }} button onPress={() => { this.deleteAppointment(item.id) }}>
            <Text>X</Text>
          </Button>  
        </Right>
      </ListItem>
      // <ListItem style={{ marginLeft: 0 }} >
      //   <Body>
      //   <Grid>
      //       <Col size={5}>
      //         <Text>{item.name}</Text>
      //         <Text>{item.mobileNumber}</Text>
      //       </Col>
      //       <Col size={4}>

      //       <Text> {Moment(item.appointmentDate).format('YYYY-MM-DD HH:mm:ss')} </Text>
      //       </Col>
      //       <Col size={1}>
      //         <Button style={{ backgroundColor: "red" }} button onPress={() => { this.deleteAppointment(item.id) }}>
      //         <Text>X</Text>
      //         </Button>
      //       </Col>

      //     </Grid>

      //   </Body>
      // </ListItem>
    );
  };
  render() {
    return (

      <Container style={styles.container}>


        <Modal style={{ margin: 22 }}
          animationType="slide"
          transparent={false}
          visible={this.state.active}
          onRequestClose={() => {
            this.setState({ active: false });
          }}>
          <Form>
            <Item floatingLabel>
              <Label>Name Of Patient</Label>
              <Input value={this.state.nameOfPatient} onChangeText={(username) => this.setState({ nameOfPatient: username })} />
            </Item>
            <Item floatingLabel last>
              <Label>Mobile Number</Label>
              <Input value={this.state.mobileNumber} onChangeText={(number) => this.setState({ mobileNumber: number })} />
            </Item>
            <Item floatingLabel last>
              <Label>Date And Time</Label>
              <Input onFocus={this._showDateTimePicker} value={this.state.dateTime} />
              <Icon active name='home' onPress={this._showDateTimePicker} />
            </Item>

            <DateTimePicker
              isVisible={this.state.isDateTimePickerVisible}
              onConfirm={this._handleDatePicked}
              onCancel={this._hideDateTimePicker}
              mode={'datetime'}
            />
            {this.state.addActive &&
              <Button visible={this.state.addActive} active full onPress={this.addAppointment}>
                <Text>Add </Text>
              </Button>
            }
            {this.state.searchActive &&
              <Button visible={this.state.searchActive} active full onPress={this.searchAppointment}>
                <Text>Search</Text>
              </Button>
            }


          </Form>
        </Modal>

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
            <Title>Today</Title>
          </Body>
          <Right>
            <Button
              transparent
              onPress={this.openAppointmentSearchModal}
            >
              <Icon name="ios-search" />
            </Button>
          </Right>


        </Header>

        <Content padder>
          <Spinner visible={this.state.isLoading} textContent={"Loading..."} textStyle={{ color: 'red' }} />
          <FlatList
            data={this.state.data}
            renderItem={this.renderItem}
            keyExtractor={item => item.name}
            extraData={this.state}

          />

        </Content>




        <Fab
          active={this.state.active}
          direction="up"
          containerStyle={{}}
          style={{ backgroundColor: '#5067FF' }}
          position="bottomRight"
          onPress={this.openAppointmentAddModal}>
          <Icon name="ios-add-circle-outline" />

        </Fab>
      </Container>
    );
  }
}

export default AppointmentsToday;




