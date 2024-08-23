import classes from "./loader-small.module.scss"

export default function LoaderSmall() {
  return (
    <div className={`${classes.loader} flex items-center justify-center`}>
      <span className={classes.bar}></span>
      <span className={classes.bar}></span>
      <span className={classes.bar}></span>
    </div>
  )
}
