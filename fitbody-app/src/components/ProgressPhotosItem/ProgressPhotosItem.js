import React, { Component } from 'react'
import { Image, StyleSheet, TouchableOpacity, Text, View } from 'react-native'
import moment from 'moment'
import globals from '../../config/globals'
import { withNavigation } from '@react-navigation/compat'

class ProgressPhotosItem extends Component {
  render() {
    // console.log(this.props);
    return (
      <View style={styles.container}>
        <Text style={styles.date}>{moment(this.props.createdDate).format('MMM DD, YYYY')}</Text>
        {/* <TouchableOpacity
      style={[styles.photoView, props.photoStyle ? props.photoStyle : null]}
      onPress={props.handlePress ? props.handlePress : null}
    >
      {props.picture ? (
        <Image source={{ uri: props.picture }} style={styles.image} />
      ) : (
        <View style={styles.plusIcon}>
          <Text style={styles.plusLabel}>+</Text>
        </View>
      )}
    </TouchableOpacity> */}
        <View style={styles.photoContainer}>
          {this.props.viewType === 'FRONT' ? (
            <TouchableOpacity onPress={this.props.photoClick}>
              <Image source={{ uri: this.props.picture }} style={styles.image} />
            </TouchableOpacity>
          ) : (
            <View style={styles.image} />
          )}
          {this.props.viewType === 'SIDE' ? (
            <TouchableOpacity onPress={this.props.photoClick}>
              <Image source={{ uri: this.props.picture }} style={styles.image} />
            </TouchableOpacity>
          ) : (
            <View style={styles.image} />
          )}
          {this.props.viewType === 'BACK' ? (
            <TouchableOpacity onPress={this.props.photoClick}>
              <Image source={{ uri: this.props.picture }} style={styles.image} />
            </TouchableOpacity>
          ) : (
            <View style={styles.image} />
          )}
        </View>
      </View>
    )
  }
}
export default withNavigation(ProgressPhotosItem)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginTop: 10,
    width: globals.window.width,
  },
  date: {
    fontSize: 16,
    color: globals.styles.colors.colorLove,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    marginBottom: 10,
    marginLeft: 10,
  },
  photoContainer: {
    flexDirection: 'row',
  },
  image: {
    height: 130,
    width: 100,
    marginLeft: 8,
    marginRight: 8,
    backgroundColor: globals.styles.colors.colorGrayLight,
  },
})
