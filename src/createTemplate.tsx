import React from 'react'
import ReactPDF, { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer'

const PDF = ({ data }: { data: any }) => {
  return (<Document>
    <Page size="A4">
      <Text>Test</Text>
    </Page>
  </Document>)
}


export default async (data: any) => {
  const blob = await ReactPDF.renderToStream(<PDF {...{ data }} />)
  return blob
}