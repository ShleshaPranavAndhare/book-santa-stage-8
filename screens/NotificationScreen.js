import React ,{Component} from 'react'
import {View, Text,TouchableOpacity,ScrollView,FlatList,StyleSheet, ImageComponent} from 'react-native';
import {Card,Icon,ListItem} from 'react-native-elements'
import MyHeader from '../components/MyHeader.js'
import firebase from 'firebase';
import db from '../config.js'

export default class NotificationScreen extends Component{
    constructor(props){
        super(props)
        this.state={
            userId: firebase.auth().currentUser.email,
            allNotifications: []
        },
        this.notificationRef=null
    }
    getNotifications=()=>{
        this.requestRef=db.collection("all_notifications")
        .where("notification_status", "==", "unread")
        .where("targeted_user_id", "==", this.state.userId)
        .onSnapshot((snapshot)=>{
            var allNotifications=[]
            snapshot.docs.map((doc)=>{
                var notification=doc.data()
                notification["doc_id"]=doc.id 
                allNotifications.push(notification)
            })
            this.setState({
                allNotifications: allNotifications
            })
        })
    }
    componentDidMount(){
        this.getNotifications()
    }
    componentWillUnmount(){
        this.notificationRef()
    }
    keyExtractor=(item, index)=>index.toString()

    renderItem=({item, i})=>{
        return(
            <ListItem
                key={i}
                bottomDivider>
            <ListItem.Content>
                <ListItem.Title>
                    {
                        item.bookName
                    }
                </ListItem.Title>
                <Icon name="Book" type="font-awesome" color='#696969'/>
                
            </ListItem.Content>
            </ListItem>
        )
    }

    render(){
        return(
            <View style={{flex: 1}}>
                <View style={{flex: 0.1}}>
                    <MyHeader Title={"Notificatios"}
                    navigation={this.props.navigation}
                    />

                </View>

                <View style={{flex: 0.9}}>
                    {
                        this.state.allNotifications.length===0?
                        (
                            <view style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontSize: '25'}}>
                                    You have no Notifications
                                </Text>
                            </view>
                        )
                        :
                        (
                            <FlatList
                            keyExtractor={this.keyExtractor}
                            data={this.state.allNotifications}
                            renderItem={this.renderItem}
                            />
                        )
                    }
                </View>
            </View>
        )
    }
    
}