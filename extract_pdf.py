import pdfplumber
import sys
import os

def extract_pdf_text(pdf_path):
    """Extract text from PDF file using pdfplumber"""
    try:
        text = ""
        with pdfplumber.open(pdf_path) as pdf:
            print(f"Number of pages: {len(pdf.pages)}\n")
            print("=" * 80)
            
            for page_num, page in enumerate(pdf.pages, 1):
                page_text = page.extract_text()
                if page_text:
                    text += f"\n\n--- PAGE {page_num} ---\n\n"
                    text += page_text
                    print(f"--- PAGE {page_num} ---")
                    print(page_text)
                    print("=" * 80)
            
            # Save to text file
            output_file = pdf_path.replace('.pdf', '_extracted.txt')
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(text)
            
            print(f"\n\nText extracted and saved to: {output_file}")
            return text
            
    except FileNotFoundError:
        print(f"Error: File not found at {pdf_path}")
        return None
    except Exception as e:
        print(f"Error extracting PDF: {str(e)}")
        return None

if __name__ == "__main__":
    pdf_path = r"C:\Users\malek\Downloads\everest_captures_commentaires.pdf"
    
    if not os.path.exists(pdf_path):
        print(f"PDF file not found at: {pdf_path}")
        sys.exit(1)
    
    extract_pdf_text(pdf_path)
