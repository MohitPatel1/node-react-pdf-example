import React from 'react'
import ReactPDF, { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer'
import { ListDetailedWebWorkerPDF } from "./listDetailedPdf/DetailedPdfUI";

export default async (data: any) => {
  const blob = await ReactPDF.renderToStream(<ListDetailedWebWorkerPDF data={data} />)
  return blob
}