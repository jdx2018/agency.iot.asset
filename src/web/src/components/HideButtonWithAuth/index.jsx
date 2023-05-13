import React from 'react'
import { HideBox } from 'components'

import { getFuncs } from 'utils/auth'

const HideButtonWithAuth = ({ funcId, children }) => <HideBox condition={getFuncs()?.[funcId]?.funcStatus === 1 ?? false}>{children}</HideBox>

export default HideButtonWithAuth