db.User.findOne({email: 'jdoe@bookcars.ma'});

db.User.findOne({_id: ObjectId('628a5337572a010c6b5d1b03')})

db.Notification.find({user: ObjectId('628a5337572a010c6b5d1b03')});

db.Booking.find({driver: ObjectId('628a5337572a010c6b5d1b03')})

db.User.find({email: 'europcar@bookcars.ma'})


db.User.find({_id: ObjectId('628a5297572a010c6b5d1ac8')})

db.Car.find({company: ObjectId('628a5297572a010c6b5d1ac8')})

db.Booking.find();

db.PushNotification.find();

db.User.update({_id: ObjectId('628a5337572a010c6b5d1b03')}, {$set: {email: 'jdoe@ittranducloc.io.vn'}})
db.User.update({_id: ObjectId('628a5297572a010c6b5d1ac8')}, {$set: {email: 'europcar@ittranducloc.io.vn'}})