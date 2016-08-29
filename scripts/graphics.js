function Graphics(view) {
    let midCtx = view.mid.getContext('2d');

    this.clear = function() {
        midCtx.fillStyle = '#333';
        midCtx.fillRect(0, 0, view.mid.width, view.mid.height);
    };

    this.drawBoard = function(board) {
        TilePainter.resize(view.mid.width, board.length);
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                TilePainter.paint(midCtx, i, j, board[i][j]);
            }
        }
    };
}

let TilePainter = {
    resize: function(canvasSize, boardSize) {
        this.size = canvasSize / (boardSize + 0.5);
        this.padding = this.size / 4;
        this.outline = this.size / 20;
        this.width = this.size - this.outline * 2;
        this.height = this.width * 6 / 7;
        this.shadow = this.width / 7;
        this.radius = this.size / 8;
        let xThickness = this.width / 6;
        let yThickness = xThickness * 6 / 7;
        this.line = {
            horizontal: {
                width: (this.width - xThickness) / 2,
                height: yThickness
            },
            vertical: {
                width: xThickness,
                height: (this.height - yThickness) / 2
            }
        };
    },
    paint: function(ctx, x, y, tile) {
        x = this.padding + x * this.size + this.outline;
        y = this.padding + y * this.size + this.outline;

        this.drawOutline(ctx, x - this.outline, y - this.outline);

        if(!(tile.n || tile.w || tile.s || tile.e)) {
            this.drawGlitch(ctx, x, y, tile);
            return;
        }

        ctx.fillStyle = '#B0A274';
        roundRect(ctx, x, y + this.shadow, this.width, this.height, this.radius);
        ctx.fillStyle = '#F9ECC0';
        roundRect(ctx, x, y, this.width, this.height, this.radius);
        ctx.fillStyle = 'black';
        if (tile.n)
            ctx.fillRect(x + this.line.horizontal.width, y, this.line.vertical.width, this.line.vertical.height);
        if (tile.w)
            ctx.fillRect(x, y + this.line.vertical.height, this.line.horizontal.width, this.line.horizontal.height);
        if (tile.s)
            ctx.fillRect(x + this.line.horizontal.width, y + this.line.vertical.height + this.line.horizontal.height, this.line.vertical.width, this.line.vertical.height);
        if (tile.e)
            ctx.fillRect(x + this.line.horizontal.width + this.line.vertical.width, y + this.line.vertical.height, this.line.horizontal.width, this.line.horizontal.height);
        ctx.beginPath();
        ctx.ellipse(x + this.width / 2, y + this.height / 2, this.line.vertical.width / Math.sqrt(2), this.line.horizontal.height / Math.sqrt(2), 0, 0, 2 * Math.PI);
        ctx.fill();
    },
    drawOutline: function(ctx, x, y) {
        ctx.fillStyle = '#181818';
        roundRect(ctx, x, y, this.size, this.size, this.radius);
    },
    drawGlitch: function(ctx, x, y, tile) {
        tile.hue = tile.hue || Math.random() * 360;
        if(Math.random() < 0.03)
            tile.hue = Math.random() * 360;
        ctx.fillStyle = 'hsl(' + tile.hue + ', 100%, 35%)';
        roundRect(ctx, x, y + this.shadow, this.width, this.height, this.radius);
        ctx.fillStyle = 'hsl(' + tile.hue + ', 80%, 50%)';
        roundRect(ctx, x, y, this.width, this.height, this.radius);
    }
}

function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
}