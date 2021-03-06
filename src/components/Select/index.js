import Select from 'react-select'

const customStyles = {
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#2684FF' : '#FFF',
        color: state.isSelected ? '#FFF' : '#000',
        border: state.isFocused ? 0 : 0,
        outline: 'none'
    }),
    valueContainer: (provided, state) => ({
        ...provided,
        paddingTop: 0,
        paddingBottom: 0,
        border: 0,
        outline: 'none'
    }),
    container: (provided, state) => ({
        ...provided,
        paddingTop: 0,
        paddingBottom: 0,
        border: 0,
        outline: 'none'
    }),
    indicatorsContainer: (provided, state) => ({
        ...provided,
        paddingTop: 0,
        paddingBottom: 0,
        border: 0,
        outline: 'none'
    }),
    input: (provided, state) => ({
        ...provided,
        border: 0,
        outline: 'none'
    }),
    control: (provided, state) => ({
        ...provided,
        border: '1px solid #CCCCCC',
        borderRadius: 0,
        outline: 'none',
        boxShadow: 'none'
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