package com.fitbody.nativemodules.audioduckingmodule

import android.content.Context
import android.media.AudioFocusRequest
import android.media.AudioManager
import android.os.Build
import android.util.Log
import androidx.annotation.RequiresApi

class AudioDuckingService: AudioManager.OnAudioFocusChangeListener {
    private var mContext: Context
    private var mAudioManager: AudioManager

    var mAudioFocusGranted = false
    var TAG = "AudioDuckingService"

    constructor(reactContext: Context) {
        this.mContext = reactContext

        this.mAudioManager = reactContext.getSystemService(Context.AUDIO_SERVICE) as AudioManager
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    fun duckAudioOreo(): String? {
        val focusRequest = AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK)
            .setAcceptsDelayedFocusGain(true)
            .setOnAudioFocusChangeListener(this)
            .build()
        val requestAudioFocusResponse = mAudioManager.requestAudioFocus(focusRequest)
        return parseAudioRequestResponse(requestAudioFocusResponse)
    }

    @RequiresApi(api = Build.VERSION_CODES.FROYO)
    fun duckAudioFroyo(): String? {
        val requestAudioFocusResponse = mAudioManager.requestAudioFocus(this, AudioManager.USE_DEFAULT_STREAM_TYPE, AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK)
        return parseAudioRequestResponse(requestAudioFocusResponse)
    }

    fun abandonAudioFocus(): String? {
        val result = mAudioManager.abandonAudioFocus(this)
        return parseAudioRequestResponse(result)
    }

    private fun parseAudioRequestResponse(audioResponse: Int): String? {
        when (audioResponse) {
            AudioManager.AUDIOFOCUS_REQUEST_FAILED -> {
                mAudioFocusGranted = false
                return "AUDIOFOCUS_REQUEST_FAILED";
            }
            AudioManager.AUDIOFOCUS_REQUEST_GRANTED -> {
                mAudioFocusGranted = true
                return "AUDIOFOCUS_REQUEST_GRANTED";
            }
            AudioManager.AUDIOFOCUS_REQUEST_DELAYED -> {
                mAudioFocusGranted = false
                return "AUDIOFOCUS_REQUEST_DELAYED"
            }
        }
        return null
    }

    override fun onAudioFocusChange(focusChange: Int) {
        when (focusChange) {
            AudioManager.AUDIOFOCUS_GAIN -> Log.i(TAG, "AUDIOFOCUS_GAIN")
            AudioManager.AUDIOFOCUS_GAIN_TRANSIENT -> Log.i(TAG, "AUDIOFOCUS_GAIN_TRANSIENT")
            AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK -> Log.i(TAG, "AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK")
            AudioManager.AUDIOFOCUS_LOSS -> Log.e(TAG, "AUDIOFOCUS_LOSS")
            AudioManager.AUDIOFOCUS_LOSS_TRANSIENT -> Log.e(TAG, "AUDIOFOCUS_LOSS_TRANSIENT")
            AudioManager.AUDIOFOCUS_LOSS_TRANSIENT_CAN_DUCK -> Log.e(TAG, "AUDIOFOCUS_LOSS_TRANSIENT_CAN_DUCK")
            AudioManager.AUDIOFOCUS_REQUEST_FAILED -> Log.e(TAG, "AUDIOFOCUS_REQUEST_FAILED")
            else -> {
            }
        }
    }
}