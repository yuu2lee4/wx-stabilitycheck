# 说明
微信小程序检测手机握持稳定性的库，可用于相机拍照等场景

# 用法
````javascript
import StabilityCheck from 'wx-stabilitycheck'

const stabilityCheck = new StabilityCheck();

stabilityCheck.onStabilityChange((status) => {
    console.log('Current status of device is stability: ', status);
})

stabilityCheck.start();

// when leave page
stabilityCheck.stop();
````