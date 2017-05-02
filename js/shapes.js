function Cell(row,col,img){
	this.row=row;
	this.col=col;
	this.img=img;
	if(!Cell.prototype.drop){
		Cell.prototype.drop=function(){
			this.row++;
		}
	}
	if(!Cell.prototype.moveR){
		Cell.prototype.moveR=function(){
			this.col++;
		}
	}
	if(!Cell.prototype.moveL){
		Cell.prototype.moveL=function(){
			this.col--;
		}
	}
}
function State(r0,c0,r1,c1,r2,c2,r3,c3){
	//��0��cell����ڲ���cell���±�ƫ����
	this.r0=r0;
	this.c0=c0;
	//��1��cell����ڲ���cell���±�ƫ����
	this.r1=r1;
	this.c1=c1;
	//��2��cell����ڲ���cell���±�ƫ����
	this.r2=r2;
	this.c2=c2;
	//��3��cell����ڲ���cell���±�ƫ����
	this.r3=r3;
	this.c3=c3;
}
function Shape(img,orgi){
	this.img=img;
	this.orgi=orgi;//���浱ǰͼ���в��ո���cells�����е��±�
	this.states=[];//����ÿ��ͼ�β�ͬ״̬������
	this.statei=0;//Ĭ������ͼ�ε����״̬����0
	if(!Shape.prototype.drop){
		//������ǰ�����cells�е�ÿ��cell����
		//	���õ�ǰcell�����drop����
		Shape.prototype.drop=function(){
			for(var i=0;i<this.cells.length;i++){
				this.cells[i].drop();
			}
		}
	}
	if(!Shape.prototype.moveR){
		Shape.prototype.moveR=function(){
			for(var i=0;i<this.cells.length;i++){
				this.cells[i].moveR();
			}
		}
	}
	if(!Shape.prototype.moveL){
		Shape.prototype.moveL=function(){
			for(var i=0;i<this.cells.length;i++){
				this.cells[i].moveL();
			}
		}
	}
	if(!Shape.prototype.rotateR){
		Shape.prototype.rotateR=function(){
			//if(Object.getPrototypeOf(this)!=O.prototype){
			if(this.constructor!=O){
				this.statei++;
				this.statei>=this.states.length&&(this.statei=0);
				//�����һ��״̬����
				var state=this.states[this.statei];
				var orgr=this.cells[this.orgi].row;
				var orgc=this.cells[this.orgi].col;
				//������ǰͼ���е�ÿ��cell
				//��state��ƫ����,����ÿ��cell����λ��
				for(var i=0;i<this.cells.length;i++){
					this.cells[i].row=orgr+state["r"+i];
					this.cells[i].col=orgc+state["c"+i];
				}
			}
		}
	}
	if(!Shape.prototype.rotateL){
		Shape.prototype.rotateL=function(){
			//if(Object.getPrototypeOf(this)!=O.prototype){
			if(this.constructor!=O){
				this.statei--;
				this.statei<0&&(this.statei=this.states.length-1);
				//�����һ��״̬����
				var state=this.states[this.statei];
				var orgr=this.cells[this.orgi].row;
				var orgc=this.cells[this.orgi].col;
				//������ǰͼ���е�ÿ��cell
				//��state��ƫ����,����ÿ��cell����λ��
				for(var i=0;i<this.cells.length;i++){
					this.cells[i].row=orgr+state["r"+i];
					this.cells[i].col=orgc+state["c"+i];
				}
			}
		}
	}
}
function O(){
	Shape.call(this,"img/O.png");
	if(!Shape.prototype.isPrototypeOf(O.prototype)){
		Object.setPrototypeOf(O.prototype,Shape.prototype);
	}
	this.cells=[
		new Cell(0,4,this.img),
		new Cell(0,5,this.img),
		new Cell(1,4,this.img),
		new Cell(1,5,this.img)
	];
}
function T(){
	Shape.call(this,"img/T.png",1);
	if(!Shape.prototype.isPrototypeOf(T.prototype)){
		Object.setPrototypeOf(T.prototype,Shape.prototype);
	}
	this.cells=[
		new Cell(0,3,this.img),
		new Cell(0,4,this.img),//���ո�
		new Cell(0,5,this.img),
		new Cell(1,4,this.img)
	];
	//����״̬
	this.states[0]=new State(0,-1,0,0,0,1,1,0);
	this.states[1]=new State(-1,0,0,0,1,0,0,-1);
	this.states[2]=new State(0,1,0,0,0,-1,-1,0);
	this.states[3]=new State(1,0,0,0,-1,0,0,1);
}
function I(){
	Shape.call(this,"img/I.png",1);
	if(!Shape.prototype.isPrototypeOf(I.prototype)){
		Object.setPrototypeOf(I.prototype,Shape.prototype);
	}
	this.cells=[
		new Cell(0,3,this.img),
		new Cell(0,4,this.img),//���ո�
		new Cell(0,5,this.img),
		new Cell(0,6,this.img)
	];
	//�൱��this.states=[];
	//I��2����̬
	this.states[0]=new State(0,-1,0,0,0,1,0,2);
						 //  [0]  [1] [2] [3]���ŵ�
	this.states[1]=new State(-1,0,0,0,1,0,2,0);
}
function S(){
	Shape.call(this,"img/S.png",3);
	if(!Shape.prototype.isPrototypeOf(S.prototype)){
		Object.setPrototypeOf(S.prototype,Shape.prototype);
	}
	this.cells=[
		new Cell(0,4,this.img),
		new Cell(0,5,this.img),
		new Cell(1,3,this.img),
		new Cell(1,4,this.img)//���ո�
	];
	this.states[0]=new State(-1,0,-1,1,0,-1,0,0);
	this.states[1]=new State(0,-1,-1,-1,1,0,0,0);
}
function Z(){
	Shape.call(this,"img/Z.png",2);
	if(!Shape.prototype.isPrototypeOf(Z.prototype)){
		Object.setPrototypeOf(Z.prototype,Shape.prototype);
	}
	this.cells=[
		new Cell(0,3,this.img),
		new Cell(0,4,this.img),
		new Cell(1,4,this.img),//���ո�
		new Cell(1,5,this.img)
	];
	this.states[0]=new State(-1,-1,-1,0,0,0,0,1);
	this.states[1]=new State(-1,1,0,1,0,0,1,0);
}
function L(){
	Shape.call(this,"img/L.png",1);
	if(!Shape.prototype.isPrototypeOf(L.prototype)){
		Object.setPrototypeOf(L.prototype,Shape.prototype);
	}
	this.cells=[
		new Cell(0,3,this.img),
		new Cell(0,4,this.img),//���ո�
		new Cell(0,5,this.img),
		new Cell(1,3,this.img)
	];
	this.states[0]=new State(0,-1,0,0,0,1,1,-1);
	this.states[1]=new State(-1,0,0,0,1,0,-1,-1);
	this.states[2]=new State(0,1,0,0,0,-1,-1,1);
	this.states[3]=new State(1,0,0,0,-1,0,1,1);
}
function J(){
	Shape.call(this,"img/J.png",1);
	if(!Shape.prototype.isPrototypeOf(J.prototype)){
		Object.setPrototypeOf(J.prototype,Shape.prototype);
	}
	this.cells=[
		new Cell(0,3,this.img),
		new Cell(0,4,this.img),//���ո�
		new Cell(0,5,this.img),
		new Cell(1,5,this.img)
	];
	this.states[0]=new State(0,-1,0,0,0,1,1,1);
	this.states[1]=new State(-1,0,0,0,1,0,1,-1);
	this.states[2]=new State(0,1,0,0,0,-1,-1,-1);
	this.states[3]=new State(1,0,0,0,-1,0,-1,1);
}