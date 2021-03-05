import styles from "./button.module.css";

function Button(props) {
    return (
        <div className={styles.button}>{props.children}</div>
    )
}

export default Button;