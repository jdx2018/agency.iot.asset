import React from 'react'

const HideBox = ({ condition = true, children }) => condition ? <>{children}</> : null

export default HideBox