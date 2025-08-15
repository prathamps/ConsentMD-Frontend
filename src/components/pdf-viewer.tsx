"use client"

import { useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import "react-pdf/dist/esm/Page/AnnotationLayer.css"
import "react-pdf/dist/esm/Page/TextLayer.css"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2, ZoomIn, ZoomOut, RotateCw } from "lucide-react"

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PDFViewerProps {
	isOpen: boolean
	onClose: () => void
	fileUrl: string | null
}

export function PDFViewer({ isOpen, onClose, fileUrl }: PDFViewerProps) {
	const [numPages, setNumPages] = useState<number | null>(null)
	const [pageNumber, setPageNumber] = useState(1)
	const [scale, setScale] = useState(1.0)
	const [rotation, setRotation] = useState(0)

	function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
		setNumPages(numPages)
		setPageNumber(1) // Reset to first page on new document load
	}

	const goToPrevPage = () =>
		setPageNumber((prev) => (prev - 1 > 0 ? prev - 1 : 1))
	const goToNextPage = () =>
		setPageNumber((prev) =>
			numPages && prev + 1 <= numPages ? prev + 1 : prev
		)

	const handleClose = () => {
		onClose()
		// Reset state when closing
		setNumPages(null)
		setPageNumber(1)
		setScale(1.0)
		setRotation(0)
	}

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="max-w-[95vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl h-[90vh] flex flex-col ml-0 sm:ml-auto">
				<DialogHeader>
					<DialogTitle>Document Viewer</DialogTitle>
				</DialogHeader>
				<div
					onContextMenu={(e) => e.preventDefault()}
					className="flex-grow overflow-auto flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4"
				>
					{fileUrl ? (
						<Document
							file={fileUrl}
							onLoadSuccess={onDocumentLoadSuccess}
							onLoadError={(error) =>
								toast.error(`Failed to load PDF: ${error.message}`)
							}
							loading={
								<div className="flex items-center space-x-2">
									<Loader2 className="h-8 w-8 animate-spin" />
									<p>Loading document...</p>
								</div>
							}
						>
							<Page
								pageNumber={pageNumber}
								scale={scale}
								rotate={rotation}
								renderAnnotationLayer={false}
								renderTextLayer={false}
							/>
						</Document>
					) : (
						<p>No document URL provided.</p>
					)}
				</div>
				<DialogFooter className="flex-col sm:flex-row sm:justify-between items-center">
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							onClick={() => setScale((s) => s - 0.2)}
							disabled={scale <= 0.4}
						>
							<ZoomOut className="h-4 w-4" />
						</Button>
						<span className="text-sm w-12 text-center">
							{Math.round(scale * 100)}%
						</span>
						<Button
							variant="outline"
							onClick={() => setScale((s) => s + 0.2)}
							disabled={scale >= 3.0}
						>
							<ZoomIn className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							onClick={() => setRotation((r) => (r + 90) % 360)}
						>
							<RotateCw className="h-4 w-4" />
						</Button>
					</div>
					<div className="flex items-center gap-2">
						<Button
							onClick={goToPrevPage}
							disabled={pageNumber <= 1}
							variant="outline"
						>
							Previous
						</Button>
						<p className="text-sm">
							Page {pageNumber} of {numPages || "--"}
						</p>
						<Button
							onClick={goToNextPage}
							disabled={!numPages || pageNumber >= numPages}
							variant="outline"
						>
							Next
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
