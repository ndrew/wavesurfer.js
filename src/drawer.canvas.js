'use strict';

WaveSurfer.Drawer.Canvas = Object.create(WaveSurfer.Drawer);

WaveSurfer.util.extend(WaveSurfer.Drawer.Canvas, {
    createElements: function () {
        var waveCanvas = document.createElement('canvas');
        this.style(waveCanvas, {
            position: 'absolute',
            zIndex: 1
        });
        var waveCc = waveCanvas.getContext('2d');

        var progressWave = document.createElement('wave');
        this.style(progressWave, {
            position: 'absolute',
            zIndex: 2,
            overflow: 'hidden',
            width: '0',
            borderRight: [
                this.params.cursorWidth + 'px',
                'solid',
                this.params.cursorColor
            ].join(' ')
        });

        var progressCanvas = document.createElement('canvas');
        var progressCc = progressCanvas.getContext('2d');
        progressWave.appendChild(progressCanvas);

        var marksCanvas = document.createElement('canvas');
        this.style(marksCanvas, {
            position: 'absolute',
            zIndex: 3
        });
        var marksCc = marksCanvas.getContext('2d');

        var selectionCanvas = document.createElement('canvas');
        this.style(selectionCanvas, {
            position: 'absolute',
            zIndex: 4
        });
        var selectionCc = marksCanvas.getContext('2d');


        var wrapper = document.createElement('wave');
        this.style(wrapper, {
            position: 'relative'
        });
        wrapper.appendChild(waveCanvas);
        wrapper.appendChild(progressWave);
        wrapper.appendChild(marksCanvas);
        wrapper.appendChild(selectionCanvas);

        this.container.appendChild(wrapper);

        this.canvases = [ waveCanvas, progressCanvas, marksCanvas, selectionCanvas ];

        this.waveCc = waveCc;
        this.progressCc = progressCc;
        this.progressWave = progressWave;
        this.marksCc = marksCc;
        this.selectionCc = selectionCc;
    },

    updateWidth: function () {
        this.canvases.forEach(function (canvas) {
            canvas.width = this.width;
            canvas.height = this.height;

            if (this.params.fillParent && !this.params.scrollParent) {
                this.style(canvas, {
                    width: this.container.clientWidth + 'px',
                    height: this.container.clientHeight + 'px'
                });
            } else {
                this.style(canvas, {
                    width: Math.round(this.width / this.pixelRatio) + 'px',
                    height: Math.round(this.height / this.pixelRatio) + 'px'
                });
            }
        }, this);
    },

    drawWave: function (peaks, max) {
        for (var i = 0; i < this.width; i++) {
            var h = max > 0 ? Math.round(peaks[i] * (this.height / max)) : 1;
            var y = Math.round((this.height - h) / 2);
            this.waveCc.fillStyle = this.params.waveColor;
            this.waveCc.fillRect(i, y, 1, h);
            this.progressCc.fillStyle = this.params.progressColor;
            this.progressCc.fillRect(i, y, 1, h);
        }
    },

    updateProgress: function (progress) {
        var pos = Math.round(
            this.width * progress
        ) / this.pixelRatio;
        this.progressWave.style.width = pos + 'px';
    },

    addMark: function (mark) {
        this.marksCc.fillStyle = mark.color;
        var x = Math.round(mark.percentage * this.width - mark.width / 2);
        this.marksCc.fillRect(x, 0, mark.width, this.height);
    },

    removeMark: function (mark) {
        var x = Math.round(mark.percentage * this.width - mark.width / 2);
        this.marksCc.clearRect(x, 0, mark.width, this.height);
    },

    updateSelection: function(selection) {
        if (!selection.start && !selection.end) {
            this.selectionCc.clearRect(0, 0, this.width, this.height);
        } else {
            this.selectionCc.clearRect(0, 0, this.width, this.height);
            this.selectionCc.fillStyle = selection.color;
            var start = selection.start * this.width;
            var end = (selection.end ? selection.end : selection.current) * this.width;
            if (end < start) {
                var tmp = start;
                start = end;
                end = tmp;
            }            
            this.selectionCc.fillRect(start, 0, end-start, this.height);
        }
    }

});