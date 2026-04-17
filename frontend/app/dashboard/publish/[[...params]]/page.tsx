"use client"

import dynamic from 'next/dynamic';
import '../../AddItems.css'


const DynamicPublishPortfolioItem = dynamic(
  () => import('../../../components/AddItems/PublishPage'),
  { ssr: false }
)



export default function PublishPortfolioItem() {
  return (
    <DynamicPublishPortfolioItem/>
  )
}