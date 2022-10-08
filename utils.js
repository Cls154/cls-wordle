export function createKeyboard({ keyboardType, parentContainer, cb }) {
  const createKeys = ({ key, className, size = 'normal', datasetter = '', dataValue = '', callback, keyType }) => {
    const container = document.createElement(keyType);
    container.classList.add(size);
    if (key) container.textContent = key;
    if (className) container.classList.add(className);
    if (cb) container.addEventListener('click', callback);
    switch (datasetter) {
      case 'enter':
        container.dataset.enter = dataValue;
        break;
      case 'delete':
        container.dataset.delete = dataValue;
        break;
      case 'letter':
        container.dataset.letter = dataValue;
        break;
      case 'spacer':
        container.dataset.spacer = dataValue;
        break;
    }
    parentContainer.append(container);
  }

  for (const row of keyboardType) {
    for (const key of row) {
      switch (key) {
        case 'spacer':
          createKeys({ size: 'small', datasetter: 'spacer', keyType: 'div' });
          break;
        case 'enter':
          createKeys({ key: key, className: 'keyboard-elem', size: 'large', datasetter: 'enter', callback: cb, keyType: 'button' });
          break;
        case 'delete':
          createKeys({ key: key, className: 'keyboard-elem', size: 'large', datasetter: 'delete', callback: cb, keyType: 'button' });
          break;
        default:
          createKeys({ key: key, className: 'keyboard-elem', datasetter: 'letter', dataValue: key, callback: cb, keyType: 'button' });
          break;
      }
    }
  }
}

export function createGameBoard({ rows, columns, parent }) {
  for (let i=0; i<rows; i++) {
    const divParent = document.createElement('div');
    divParent.classList.add('box-container');
    for (let j=0; j<columns; j++) {
      const divChild = document.createElement('div');
      divChild.classList.add('box');
      divChild.textContent = '';
      divParent.append(divChild);
    }
    parent.append(divParent);
  }
}