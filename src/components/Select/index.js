import Select from 'react-select'

const customStyles = {
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#2684FF' : '#FFF',
        color: state.isSelected ? '#FFF' : '#000',
    }),
    control: (provided, state) => ({
        ...provided,
        border: 0,
        borderRadius: 0,
        outline: 'none'
    }),
}

export default function SearchBox(props) {
    return (
        <>
            <Select
                {...props}
                styles={customStyles}
            />
        </>
    )
}