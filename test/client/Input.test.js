import React from 'react';
import renderer from 'react-test-renderer';
import Input from '../../src/client/components/Input';

test('Input snapshot', () => {
	const component = renderer.create(
		<Input
			className="shorten-input"
			value="test"
			placeholder="Type in a link to shorten it"
			onChange={(value) => {}}
		/>
	);
	let tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});
