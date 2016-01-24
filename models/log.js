var mongodb=require('./db');
function Log(user,message,time){
	this.message=message;
	this.user=user;
	if(time)
	{
		this.time=time;
	}
	else
	{
		this.time=new Date();
	}
}
module.exports=Log;
Log.prototype.save=function(callback){
	var post = {
		user:this.user,
		message:this.message,
		time:this.time
	};
	mongodb.open(function(err,db){
		if(err)
		{
			return callback(err);
		}
		db.collection('logs',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.insert(post,{safe:true},function(err,post)
			{
				mongodb.close();
				return callback(err,post);
			})
		})
	});
}

Log.get = function(callback){
	mongodb.open(function(err,db)
	{
		if(err){
			callback(err);
		}
		db.collection('logs',function(err,collection){
			if(err){
				callback(err);
			}
			collection.find({}).sort({time:-1}).toArray(function(err,docs){
				mongodb.close();
				if (err) {
					callback(err);
				}
				var logs = [];
				docs.forEach(function(doc, index){
					var log = new Log(doc.user, doc.message, doc.time);
					logs.push(log);
				})
				callback(null, logs);
			})
		})
	})
}

