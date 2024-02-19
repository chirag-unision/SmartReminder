package com.smartreminder

import com.facebook.react.ReactActivity

class CustActivity : ReactActivity() {
  @Override
  override fun getMainComponentName(): String {
    return "custom-component";
  }
}