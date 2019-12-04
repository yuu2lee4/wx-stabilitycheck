export default class StabilityCheck {
    SHAKE_THRESHOLD = 20;

    _lastUpdate = 0;

    _lastX = 0;

    _lastY = 0;

    _lastZ = 0;

    _status = null;

    _timer;

    _lastEmitedStatus;

    _stabilityChangeCallBack = () => {};

    constructor() {
        wx.onGyroscopeChange((res) => {
            const status = this._isStability(res);

            if (status) {
                if (!this._status || status.isStability !== this._status.isStability) {
                    this._status = status;
                }
            }
        });
    }

    _isStability({ x, y, z }) {
        const curTime = Date.now();
        if (curTime - this._lastUpdate > 10) {
            const diffTime = curTime - this._lastUpdate;
            this._lastUpdate = curTime;
            const speed = Math.abs(x + y + z - this._lastX - this._lastY - this._lastZ) / diffTime * 10000;
            this._lastX = x;
            this._lastY = y;
            this._lastZ = z;
            return {
                isStability: speed <= this.SHAKE_THRESHOLD,
                time: Date.now(),
            };
        }
    }

    start() {
        wx.startGyroscope({
            success: () => {
                console.log('start success');
                this._timer = setInterval(() => {
                    // 每秒检测一次，状态跟上次发生时不一样，如果是false，直接调用状态改变函数，如果是true，必须保证至少1s内都是true，才调用状态改变函数
                    if (this._status && this._lastEmitedStatus !== this._status.isStability) {
                        if (this._status.isStability) {
                            const curTime = Date.now();
    
                            if (curTime - 1000 >= this._status.time) {
                                this._stabilityChangeCallBack(this._status.isStability);
                                this._lastEmitedStatus = this._status.isStability;
                            }
                        } else {
                            this._stabilityChangeCallBack(this._status.isStability);
                            this._lastEmitedStatus = this._status.isStability;
                        }
                    }
                }, 1000);
            },
            fail(e) {
                console.log(e);
            },
        });
    }

    stop() {
        if (this._timer) clearInterval(this._timer);
        wx.stopGyroscope({
            success() {
                console.log('stop success');
            },
            fail(e) {
                console.log(e);
            },
        });
    }
    
    onStabilityChange(cb) {
        if (typeof cb !== 'function') throw new Error('必须传入一个函数');
        this._stabilityChangeCallBack = cb;
    }
}
