import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';

export default class SliderPhoto extends Component {

    renderImage () {
        return (
            <Image
              source={{ uri: this.props.photoURl }}
              style={styles.image}
            />
        );
    }

    render () {
        return (
            <TouchableOpacity
              activeOpacity={1}
              style={styles.slideInnerContainer}
              onPress={() => { console.log('hi'); }}
              >
                <View style={[styles.imageContainer]}>
                    { this.renderImage() }
                </View>
            </TouchableOpacity>
        );
    }
}
