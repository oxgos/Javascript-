window.$=HTMLElement.prototype.$=function(selector){
	return (this==window?document:this).querySelectorAll(selector);
}
var tetris={
	RN:20,//������
	CN:10,//������
	CSIZE:26,//ÿ����,��߶���26px

	OFFSET_X:15,//ÿ����Ԫ����඼Ҫ��15px
	OFFSET_Y:15,//ÿ����Ԫ���Ϸ���Ҫ��15px
	
	interval:200,//ÿ1���ػ�һ��
	timer:null,

	wall:[],//��������ֹͣ����ķ���

	pg:null,

	currShape:null,//ר�ű��������ƶ���ͼ�ζ���
	nextShape:null,//ר�ű�����һ��ͼ�ζ���

	state:1,//������Ϸ��ǰ��״̬
	STATE_RUNNING:1,//��Ϸ��������
	STATE_GAMEOVER:0,//��Ϸ����
	STATE_PAUSE:2,//��Ϸ��ͣ
	IMG_GAMEOVER:"img/game-over.png",
	IMG_PAUSE:"img/pause.png",

	SCORES:[0,10,50,80,200],//������5��
	score:0,//��ǰ���ܷ�
	lines:0,//��ǰ������

	paintState:function(){//���ݵ�ǰ��Ϸ״̬,Ϊ��Ϸ��Ӳ�ͬ״̬��ͼƬ
		var img=new Image();
		switch(this.state){
			case this.STATE_GAMEOVER:
				img.src=this.IMG_GAMEOVER;
				break;
			case this.STATE_PAUSE:
				img.src=this.IMG_PAUSE;
		}
		this.pg.appendChild(img);
	},

	init:function(){
		this.pg=$(".playground")[0];
		//����һ��Oͼ�εĶ���,����currShape������
		this.currShape=this.randomShape();
		this.nextShape=this.randomShape();
		//��wall�����ʼ��ΪRN�����������
		for(var i=0;i<this.RN;this.wall[i++]=[]);

		this.score=0;
		this.lines=0;
		this.state=1;
		this.paint();
		this.timer=setInterval(function(){
			tetris.drop();	
			tetris.paint();
		},this.interval);

		document.onkeydown=function(){//�¼����ڼ��̰������ɿ�ʱ����
			var e=window.event||arguments[0];
			switch(e.keyCode){//�Լ���keyCode��,�ж�Ӧ����
				case 37:tetris.moveL();break;//��
				case 39:tetris.moveR();break;//��
				case 40:tetris.drop();break;//��
				case 38: tetris.rotateR();break;
				case 90: tetris.rotateL();break;//keyCode,����unicode��д��

				case 80:tetris.pause();break;//��ͣP
				case 81:tetris.gameOver();break;//������ϷQ
				case 67:tetris.myContinue();break;//��ͣ��,������ϷC
				case 83:
					if(this.state==this.STATE_GAMEOVER){	
						tetris.init();break;//��Ϸ������,���¿�ʼS
				}
			}
		}
	},
	gameOver:function(){
		this.state=this.STATE_GAMEOVER;
		clearInterval(this.timer);
		this.timer=null;
		this.paint();
	},
	pause:function(){
		if(this.state==this.STATE_RUNNING){
			this.state=this.STATE_PAUSE;
		}
	},
	myContinue:function(){
		if(this.state==this.STATE_PAUSE){
			this.state=this.STATE_RUNNING;
		}
	},
	rotateR:function(){//����,������ת
		if(this.state==this.STATE_RUNNING){
			this.currShape.rotateR();
			if(this.outOfBounds()||this.hit()){
				this.currShape.rotateL();
			}	
		}
	},
	rotateL:function(){
		if(this.state==this.STATE_RUNNING){
			this.currShape.rotateL();
			if(this.outOfBounds()||this.hit()){
				this.currShape.rotateR();
			}	
		}	
	},
	moveR:function(){
		if(this.state==this.STATE_RUNNING){
			this.currShape.moveR();
			if(this.outOfBounds()||this.hit()){
				this.currShape.moveL();
			}	
		}
	},
	moveL:function(){
		if(this.state==this.STATE_RUNNING){
			this.currShape.moveL();
			if(this.outOfBounds()||this.hit()){
				this.currShape.moveR();
			}	
		}
	},
	outOfBounds:function(){//��鵱ǰͼ���Ƿ�Խ��
		var cells=this.currShape.cells;
		for(var i=0;i<cells.length;i++){
			if(cells[i].col<0||cells[i].col>=this.CN){
				return true;
			}
		}
		return false;
	},
	hit:function(){//��鵱ǰͼ���Ƿ���ײ
		var cells=this.currShape.cells;
		for(var i=0;i<cells.length;i++){
			if(this.wall[cells[i].row][cells[i].col]){
				return true;
			}
		}
		return false;
	},
	isGameOver:function(){//�жϵ�ǰ��Ϸ�Ƿ����
		//��ȡnextSharp������cell,����cells
		//����cells��ÿ��cell
		//	ȡ��wall�к͵�ǰcell��ͬrow,colλ�õĸ�
		//	ֻҪ������Ч��
		var cells=this.nextShape.cells;
		for(var i=0;i<cells.length;i++){
			var cell=this.wall[cells[i].row][cells[i].col];
			if(cell){
				return true;
			}
		}
		return false;
	},
	paint:function(){//�ػ����и���,�����ȵķ���
		//ÿ�ζ�Ҫɾ������img����,���ػ�
		this.pg.innerHTML=this.pg.innerHTML.replace(/<img(.*?)>/g,"");
		this.paintShape();
		this.paintWall();
		this.paintNext();
		this.paintScore();
		this.paintState();
	},
	paintScore:function(){
		$("span")[0].innerHTML=this.score;
		$("span")[1].innerHTML=this.lines;
	},
	drop:function(){
		if(this.state==this.STATE_RUNNING){
			//�ж��Ƿ������
			if(this.canDrop()){
				this.currShape.drop();
			}else{//����,�����������,�ͽ�ͼ����ÿ��cell,����wall������
				this.landIntoWall();

				//����,���ر�������������
				var ln=this.deleteLines();
				//�Ƿ�
				this.score+=this.SCORES[ln];
				this.lines+=ln;

				//�����Ϸû�н���
				if(!this.isGameOver()){
					//���ȴ���nextshape,����currSHape
					this.currShape=this.nextShape;
					//ΪnextShape����������ͼ��
					this.nextShape=this.randomShape();
				}else{//��Ϸ�Ѿ�����
					clearInterval(this.timer);
					this.timer=null;
					this.state=this.STATE_GAMEOVER;
					this.paint();//�ֶ�����һ��
				}
			}
		}
	},
	deleteLines:function(){//���wall��ÿһ���Ƿ�����
		//����wall��ÿһ��,����lines�����汾�ι�ɾ��������
		//	 �����ǰ��������
		//		ɾ����ǰ��
		//		ÿɾ��һ��,lines++
		for(var row=0,lines=0;row<this.RN;row++){
			if(this.isFull(row)){
				this.deleteL(row);
				lines++;
			}
		}
		return lines;
	},
	isFull:function(row){//�ж�ָ�����Ƿ�����
		//ȡ��wall�е�row��,����line������
		//����line��ÿ��cell
		//	ֻҪ���ֵ�ǰcell��Ч
		var line=this.wall[row];
		for(var c=0;c<this.CN;c++){
			if(!line[c]){
				return false;
			}
		}
		//(��������)
		return true;
	},
	//ɾ��ָ����,������֮������cell
	deleteL:function(row){
		this.wall.splice(row,1);//ɾ��ָ����
		this.wall.unshift([]);//����ѹ���¿���
		//��row�п�ʼ,���ϱ���ÿһ��
		//	��0��ʼ������ǰ�е�ÿ����
		//		�����ǰ����Ч
		//			����ǰ���row++
		for(var r=row;r>0;r--){
			for(var c=0;c<this.CN;c++){
				if(this.wall[r][c]){
					this.wall[r][c].row++;
				}
			}
		}
	},
	//��Ϸ��������Ͻǻ�����һ��shape
	paintNext:function(){
		//����currShappe��cells������ÿ��cell
		//�Ƚ���ǰcell��row+1,����r������
		//�Ƚ���ǰcell��col+11,����c������
		//	���㵱ǰcell��x����:cell��c*CSIZE+OFFSET_X
		//	���㵱ǰcell��y����:cell��r*CSIZE+OFFSET_y
		var cells=this.nextShape.cells;
		for(var i=0;i<cells.length;i++){
			var r=cells[i].row+1;
			var c=cells[i].col+10;
			var x=c*this.CSIZE+this.OFFSET_X;
			var y=r*this.CSIZE+this.OFFSET_Y;
			var image=new Image();
			image.src=cells[i].img;
			image.style.left=x+"px";
			image.style.top=y+"px";
			this.pg.appendChild(image);
		}
	},
	paintWall:function(){//��ӡ������ص�ǽ�еĸ�
		//������ά����wall��ÿ����
		//	�����ǰcell��Ч
		//		���㵱ǰcell��x����
		for(var i=0;i<this.RN;i++){
			for(var n=0;n<this.CN;n++){
				var cell=this.wall[i][n];
				if(cell){
					var img=new Image();
					var y=cell.row*this.CSIZE+this.OFFSET_X;
					var x=cell.col*this.CSIZE+this.OFFSET_Y;
					img.src=cell.img;
					img.style.left=x+"px";
					img.style.top=y+"px";
					this.pg.appendChild(img);
				}
			}
		}
	},
	landIntoWall:function(){
		//������ǰͼ�ε�cells������ÿ��cell
		var cells=this.currShape.cells;
		for(var i=0;i<cells.length;i++){
			this.wall[cells[i].row][cells[i].col]=cells[i];
		}
		//	ÿ����һ��cell
		//	�ͽ�cell�������wall����ͬrow,col��λ��
	},
	canDrop:function(){
		var cells=this.currShape.cells;
		for(var i=0;i<cells.length;i++){
			if(cells[i].row==this.RN-1){
				return false;
			}
			if(this.wall[cells[i].row+1][cells[i].col]){
				return false
			}
		}
		return true;
	},
	randomShape:function(){//�������һ��ͼ��
		switch(parseInt(Math.random()*7)){
			case 0:return new O();
			case 1:return new I();
			case 2:return new Z();
			case 3:return new J();
			case 4:return new L();
			case 5:return new T();
			case 6:return new S();
		}
	},
	paintShape:function(){//ר�Ż��Ƶ�ǰͼ�εķ���
		//����currShappe��cells������ÿ��cell
		//	���㵱ǰcell��x����:cell��col*CSIZE+OFFSET_X
		//	���㵱ǰcell��y����:cell��row*CSIZE+OFFSET_y
		//	����һ��image����new image();
		//  ����img�����src=cell��img����
		//	����img�����leftΪx
		//	����img�����topΪy
		//	��img����׷�ӵ�pg��
		var cells=this.currShape.cells;
		for(var i=0;i<cells.length;i++){
			var x=cells[i].col*this.CSIZE+this.OFFSET_X;
			var y=cells[i].row*this.CSIZE+this.OFFSET_Y;
			var image=new Image();
			image.src=cells[i].img;
			image.style.left=x+"px";
			image.style.top=y+"px";
			this.pg.appendChild(image);
		}
	}	
}
window.onload=function(){
	tetris.init();
}