import React from "react"
import classes from "./loader-small.module.scss"

interface LoaderSmallProps {
  color?: string
  width?: string
}

export default function LoaderSmall({
  color = "#f59e0b", // default color
  width = "3px", // default width
}: LoaderSmallProps) {
  return (
    <div className={`${classes.loader} flex items-center justify-center`}>
      <span
        className={classes.bar}
        style={{ backgroundColor: color, width }}
      ></span>
      <span
        className={classes.bar}
        style={{ backgroundColor: color, width, height: "35px" }}
      ></span>
      <span
        className={classes.bar}
        style={{ backgroundColor: color, width }}
      ></span>
    </div>
  )
}
