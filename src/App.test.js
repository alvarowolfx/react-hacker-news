import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import TestUtils from 'react-addons-test-utils';

it('should have React Hacker News written somewhere', () => {
  const app = TestUtils.renderIntoDocument(
  	<App/>
  );
  
  const appNode = ReactDOM.findDOMNode(app);  
  const header = appNode.querySelectorAll('.App-header');
  
  expect(header.length).toEqual(1);
  expect(header[0].textContent).toEqual('React Hacker News');
});
