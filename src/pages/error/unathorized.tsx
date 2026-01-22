import React from 'react'
import Error from 'next/error'

const UnauthorizedPage = () => {
  return <Error title='You do not have permission to access this page' statusCode={401} />
}

export default UnauthorizedPage
