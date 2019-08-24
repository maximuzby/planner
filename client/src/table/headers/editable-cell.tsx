import { useObserver } from 'mobx-react-lite';
import React, { useCallback, useState } from 'react';

interface EditableCellProps {
	value: string;
	setValue: (value: string) => void;
	classNamePrefix: string;
}

const InlineEditor = (props: EditableCellProps & { onBlur: () => void }) => {
	const { setValue, value, classNamePrefix, onBlur } = props;

	const onChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setValue(event.target.value);
		},
		[setValue],
	);

	return useObserver(() => (
		<input
			autoFocus={true}
			onBlur={onBlur}
			className={`${classNamePrefix}-cell-editor`}
			value={value}
			type='text'
			onChange={onChange}
		/>
	));
};

export const EditableCell = (props: EditableCellProps) => {
	const [editing, setEditing] = useState(false);

	const enableEditing = useCallback(() => {
		setEditing(true);
	}, []);

	const disableEditing = useCallback(() => {
		setEditing(false);
	}, []);

	return useObserver(() => (
		<th
			className={`planner-cell planner-cell_header ${props.classNamePrefix}-cell`}
			onClick={enableEditing}
		>
			{editing ? (
				<InlineEditor {...props} onBlur={disableEditing} />
			) : (
				<div className={`${props.classNamePrefix}-cell-text`}>
					{props.value}
				</div>
			)}
		</th>
	));
};
