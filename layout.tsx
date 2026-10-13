import type { ServerFunctionClient } from 'payload'
import React from 'react'
import config from '@payload-config'
import { generatePayloadViewport, handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import { importMap } from './admin/importMap'
import '@payloadcms/next/css'
export const generateViewport = generatePayloadViewport
const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({...args, config, importMap})
}
export default function Layout({children}:{children:React.ReactNode}){
 return <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>{children}</RootLayout>
}
