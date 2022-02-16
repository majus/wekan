import moment from 'moment';
import { TAPi18n } from '/i18n';

Blaze.registerHelper('currentBoard', () => {
  const ret = Utils.getCurrentBoard();
  return ret;
});

Blaze.registerHelper('currentCard', () => {
  const ret = Utils.getCurrentCard();
  return ret;
});

Blaze.registerHelper('currentList', () => {
  const listId = Session.get('currentList');
  if (listId) {
    return Lists.findOne(listId);
  } else {
    return null;
  }
});

Blaze.registerHelper('getUser', userId => Users.findOne(userId));

Blaze.registerHelper('concat', (...args) => args.slice(0, -1).join(''));

Blaze.registerHelper('isMiniScreen', () => Utils.isMiniScreen());

Blaze.registerHelper('isShowDesktopDragHandles', () =>
  Utils.isShowDesktopDragHandles(),
);

Blaze.registerHelper('isMiniScreenOrShowDesktopDragHandles', () =>
  Utils.isMiniScreenOrShowDesktopDragHandles(),
);

Blaze.registerHelper('moment', (...args) => {
  args.pop(); // hash
  const [date, format] = args;
  return moment(date).format(format);
});

Blaze.registerHelper('_', (...args) => {
  const { hash } = args.pop();
  const [key] = args.splice(0, 1);
  return TAPi18n.__(key, { ...hash, sprintf: args });
});
