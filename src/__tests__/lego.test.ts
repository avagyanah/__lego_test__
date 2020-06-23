import { lego } from '../';

test('Lego', () => {
  expect(lego).toHaveProperty('command');
  expect(lego).toHaveProperty('event');
  expect(lego).toHaveProperty('observe');
});

test('Event on', () => {
  const arg1 = { prop1: '1', prop2: 2 };
  const listener = (obj: any, num: number, str: string) => {
    expect(obj).toMatchObject(arg1);
    expect(num).toBe(1);
    expect(str).toBe('arg');
  };
  lego.event.on('test', listener);
  lego.event.emit('test', arg1, 1, 'arg');
  //
  lego.event.off('test', listener);
});

test('Event off', () => {
  const listener = () => {
    throw new Error('Handling removed event');
  };

  lego.event.on('test', listener);
  lego.event.off('test', listener);
  lego.event.emit('test');
  //
  lego.event.off('test', listener);
});

test('Command map', () => {
  const arg1 = { prop1: '1', prop2: 2 };
  const command = (obj: object, num: number, str: string) => {
    expect(obj).toMatchObject(arg1);
    expect(num).toBe(1);
    expect(str).toBe('arg');
  };
  lego.command.map('test', command);
  lego.event.emit('test', arg1, 1, 'arg');
  //
  lego.command.unmap('test', command);
});

test('Command unmap', () => {
  const command = () => {
    throw new Error('Executing unmaped command');
  };

  lego.command.map('test', command);
  lego.command.unmap('test', command);
  lego.event.emit('test');
});

test('Command & sub command', () => {
  const arg1 = { prop1: '1', prop2: 2 };
  const command = (obj: object, num: number, str: string) => {
    expect(obj).toMatchObject(arg1);
    expect(num).toBe(1);
    expect(str).toBe('arg');
    lego.command.execute((...args) => {
      expect(args).toMatchObject([]);
    });
  };
  lego.command.map('test', command);
  lego.event.emit('test', arg1, 1, 'arg');
  //
  lego.command.unmap('test', command);
});

test('Command & sub command with payload', () => {
  const theObj = { prop1: '1', prop2: 2 };
  const command = (obj: object, num: number, str: string) => {
    expect(obj).toMatchObject(theObj);
    expect(num).toBe(1);
    expect(str).toBe('arg');
    lego.command.payload(theObj).execute(arg => {
      expect(arg).toMatchObject(theObj);
    });
  };
  lego.command.map('test', command);
  lego.event.emit('test', theObj, 1, 'arg');
  //
  lego.command.unmap('test', command);
});

test('Command & sub command with payload and guard', () => {
  const theObj = { prop1: '1', prop2: 2 };
  const command = (obj: object, num: number, str: string) => {
    expect(obj).toMatchObject(theObj);
    expect(num).toBe(1);
    expect(str).toBe('arg');
    lego.command
      .guard(() => true)
      .payload(theObj)
      .execute(arg => {
        expect(arg).toMatchObject(theObj);
      });
    lego.command
      .guard(() => true, () => false)
      .payload(theObj)
      .execute(() => {
        throw new Error('Guards passed');
      });
  };
  lego.command.map('test', command);
  lego.event.emit('test', theObj, 1, 'arg');
  //
  lego.command.unmap('test', command);
});

test('Command & sub command with multiple payloads and guards', () => {
  const theObj = { prop1: '1', prop2: 2 };
  const command = (obj: object, num: number, str: string) => {
    expect(obj).toMatchObject(theObj);
    expect(num).toBe(1);
    expect(str).toBe('arg');
    lego.command
      .guard(() => true)
      .payload(theObj)
      .execute(arg => {
        expect(arg).toMatchObject(theObj);
      })
      .payload(0)
      .execute(arg => {
        expect(arg).toBe(0);
      });
    lego.command
      .guard(() => true, () => false)
      .payload(theObj)
      .execute(() => {
        throw new Error('Guards passed');
      });
  };
  lego.command.map('test', command);
  lego.event.emit('test', theObj, 1, 'arg');
  //
  lego.command.unmap('test', command);
});

test('Observe', () => {
  const myObj = { prop1: '2', prop2: 1 };
  lego.observe.makeObservable(myObj);
  lego.event.on('ObjectProp1Update', (newValue: string, oldValue: string) => {
    expect(oldValue).toBe('2');
    expect(newValue).toBe('3');
  });

  lego.event.on('ObjectProp2Update', (newValue: number, oldValue: number) => {
    expect(oldValue).toBe(1);
    expect(newValue).toBe(0);
  });

  myObj.prop1 = '3';
  myObj.prop2 = 0;
});