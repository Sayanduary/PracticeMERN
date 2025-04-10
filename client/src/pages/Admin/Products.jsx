import React from 'react'
import AdminMenu from '../../components/layout/AdminMenu'
import Layout from '../../components/layout/Layout'

const Products = () => {
  return (
    <Layout>
      <div className="row">
        <div className="col-md-3">
            <AdminMenu/>
        </div>
        <div className="col-md-9">
            <h1 className='text-center'>
                All products lists

            </h1>
        </div>
      </div>
    </Layout>
  )
}

export default Products
