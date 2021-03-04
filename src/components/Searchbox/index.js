import styles from "./searchbox.module.css";
import Select from '../Select'

export default function SearchBox(props) {
    return (
        <div className={styles.searchboxDiv}>
            <input
                className={styles.searchboxInput}
                type={props.type || "text"}
                placeholder={props.placeholder}
                value={props.value}
                onChange={props.onChange}
            />
            <Select
                className={styles.searchboxSelect}
                name="searchType"
                id="searchType"
                styles
                options={props.selectOptions}
                defaultValue={props.valueSelect}
                onChange={props.onChangeSelect}
            />
        </div>
    )
}