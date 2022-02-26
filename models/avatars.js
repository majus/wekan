import { Meteor } from 'meteor/meteor';
import { GridFilesCollection } from 'meteor/majus:files-gridfs';

// XXX Enforce a schema for the Attachments FilesCollection
// see: https://github.com/VeliovGroup/Meteor-Files/wiki/Schema
Avatars = new GridFilesCollection({
  collectionName: 'avatars',
  debug: Meteor.isDevelopment,
  allowClientCode: true,
  onBeforeUpload(file) {
    if (file.size <= 72000 && file.type.startsWith('image/')) {
      return true;
    }
    return 'avatar-too-big';
  },
});

function isOwner(userId, doc) {
  return userId && userId === doc.userId;
}

if (Meteor.isServer) {
  Avatars.allow({
    insert: isOwner,
    update: isOwner,
    remove: isOwner,
    fetch: ['userId'],
  });
}

export default Avatars;
