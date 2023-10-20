import { Status } from "@prisma/client";
import { prisma } from "../../db.server";
import { ServerClient } from "postmark";
import {
  ACCEPT_INSTRUCTIONS,
  COMM_PRG,
  COMM_RES,
  COMPLETED_INSTRUCTIONS,
  INVOICING_INSTRUCTIONS,
  WEBSITE_EMAIL,
  WEBSITE_NAME,
  WEBSITE_URL,
  WORK_IN_PROGRESS_NOTIF,
} from "../../constants.server";
import Commission from "../../../interfaces/commission";
import * as fs from "fs";
import pdfkit, { page } from "pdfkit";
import { Recipe } from "muhammara";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody<{
      id: string;
      price?: number;
      subscription?: number;
      status?: Status;
    }>(event);
    let commission;
    if (data.price) {
      commission = await prisma.commission.update({
        where: { id: data.id },
        include: { customer: true },
        data: {
          price: data.price,
          subscription: data.subscription,
          status: Status.PENDING,
        },
      });

      const fullName =
        commission.customer.firstname + commission.customer.middlename !==
          null &&
        commission.customer.middlename &&
        commission.customer.middlename.length > 0
          ? commission.customer.middlename + " " + commission.customer.lastname
          : commission.customer.lastname;

      generateContract(
        fullName,
        commission.customer.address,
        commission.price,
        commission.subscription
      );
    } else {
      commission = await prisma.commission.update({
        where: { id: data.id },
        include: { customer: { select: { email: true } } },
        data: {
          status: data.status,
        },
      });
    }

    const client = new ServerClient(process.env.POSTMARK_API_KEY!);

    switch (commission.status) {
      case Status.PENDING:
        client.sendEmailWithTemplate({
          From: WEBSITE_EMAIL,
          To: commission.customer.email,
          TemplateAlias: COMM_RES,
          TemplateModel: {
            product_url: WEBSITE_URL,
            product_name: WEBSITE_NAME,
            commission_title: commission.subject,
            event_detail: "Accepted",
            instructions: ACCEPT_INSTRUCTIONS,
          },
        });

        break;
      case Status.ACCEPTED:
        client.sendEmailWithTemplate({
          From: WEBSITE_EMAIL,
          To: commission.customer.email,
          TemplateAlias: COMM_PRG,
          TemplateModel: {
            product_url: WEBSITE_URL,
            product_name: WEBSITE_NAME,
            commission_title: commission.subject,
            event_detail: "in the works!",
            instructions: WORK_IN_PROGRESS_NOTIF,
          },
        });
        break;
      case Status.INVOICING:
        client.sendEmailWithTemplate({
          From: WEBSITE_EMAIL,
          To: commission.customer.email,
          TemplateAlias: COMM_PRG,
          TemplateModel: {
            product_url: WEBSITE_URL,
            product_name: WEBSITE_NAME,
            commission_title: commission.subject,
            event_detail: "awaiting a payment",
            instructions: INVOICING_INSTRUCTIONS,
          },
        });
        break;
      case Status.COMPLETED:
        client.sendEmailWithTemplate({
          From: WEBSITE_EMAIL,
          To: commission.customer.email,
          TemplateAlias: COMM_PRG,
          TemplateModel: {
            product_url: WEBSITE_URL,
            product_name: WEBSITE_NAME,
            commission_title: commission.subject,
            event_detail: "completed and finalized!",
            instructions: COMPLETED_INSTRUCTIONS,
          },
        });
        break;
    }

    const comm: Commission = {
      id: commission.id,
      description: commission.description,
      environ: commission.environment,
      pages: commission.pages,
      pwa: commission.pwa,
      subject: commission.subject,
      theme: commission.theme,
      createdAt: commission.createdAt,
      price: commission.price,
      status: commission.status,
      subscription: commission.subscription,
      updatedAt: commission.updatedAt,
    };
    return { commission: comm, customerEmail: commission.customer.email };
  } catch (error) {
    console.log(error);
  } finally {
    prisma.$disconnect();
  }
});

function generateContract(
  clientFullName: string,
  clientAddress: string,
  price: number,
  subscription: number
) {
  const output = fs.createWriteStream("web_development_contract.pdf");
  const doc = new pdfkit();

  doc.pipe(output);

  // Set the font size and styling options
  doc.fontSize(12);

  // Add the content from your agreement text with formatting
  const agreementSections = [
    {
      title: "PURCHASE AGREEMENT FOR WEBSITE DESIGN & DEVELOPMENT",
      content: `This agreement (the "Web Development Contract") is entered into between ${process
        .env.DEV_NAME!}, an individual with a mailing address at ${process.env
        .DEV_ADDRESS!} ("Developer"), and ${clientFullName}, an individual or entity with a mailing address at ${clientAddress} ("Client"), collectively referred to herein as the "Parties". Developer is an independent contractor and not an employee of any company, and possesses the necessary skills and experience to provide the services described herein.`,
    },
    {
      title: "RECITALS:",
      content: `WHEREAS, Client wishes to purchase the development of a website from Developer.`,
    },
    {
      title:
        "NOW, THEREFORE, in consideration of the mutual promises and covenants contained herein, the parties agree as follows:",
      content: `
      1. Development of Website.
         Developer agrees to design, develop, and deliver the Website to Client in accordance with Client's specifications as outlined in Exhibit A attached hereto. Developer shall use its best efforts to complete the development of the Website within the agreed timeframe. Client acknowledges and agrees that any delays in providing information, approvals, or feedback necessary for the Website's development may result in a delay in the delivery of the Website.
  
      2. Purchase of the Website.
         Upon completion of the Website, Client shall purchase the Website from Developer for the purchase price of $${price} CAD (the "Web Development Cost"), payable within 7 days after delivery of the Website to the Client. Client acknowledges and agrees that the purchase price may be adjusted if Client requests additional features or changes to the Website. If Client fails to pay any installment by the due date, Client shall be in default and Developer may, in its sole discretion, terminate this Agreement and retain any amount paid by Client as liquidated damages. Additionally, Client shall pay a penalty fee of 5% of the purchase price for any late payment.
  
      3. Intellectual Property Rights.
         Developer shall retain all intellectual property rights to any work product created by Developer in connection with the development of the Website, except for any intellectual property specifically licensed to Client as part of the Website. Client shall have a non-exclusive, perpetual license to use such intellectual property solely in connection with the Website.
  
      4. Domain Name and Hosting.
         Client shall be solely responsible for acquiring and providing a domain name for the Website, and for arranging for hosting services for the Website. If Client chooses to have Developer provide hosting and maintenance services, Client and Developer must mutually agree on the monthly fee for such services. In this case, a monthly amount of $${subscription} CAD. Client shall pay the monthly fee for hosting and maintenance services to Developer on the first of every month. If Client fails to pay the monthly fee by one week, a 15% late fee of the monthly fee will be added to the invoice. If Client fails to pay the monthly fee for two weeks, Developer may discontinue hosting and maintenance services. Client may terminate the hosting and maintenance services at any time by providing written notice to Developer.
  
      5. Acceptance and Testing.
         Developer shall make the Website available to Client for acceptance testing. Client shall have 7 days to test and accept the Website. If Client finds any errors or defects during the acceptance testing period, Client shall provide written notice to Developer specifying such errors or defects. Developer shall promptly correct such errors or defects.
  
      6. Representations and Warranties.
         Developer represents and warrants that:
         (a) Developer has the necessary expertise and skill to perform the services required under this Agreement;
         (b) the Website shall be designed and developed in a professional and workmanlike manner;
         (c) the Website shall be free from any viruses or other harmful code; and
         (d) the Website shall not infringe on any third party intellectual property rights.
  
      7. Confidentiality.
         The parties acknowledge and agree that during the course of this agreement, each party may disclose certain confidential information to the other party. Confidential information means any and all information disclosed by one party to the other party, whether orally or in writing, that is designated as confidential or that, under the circumstances surrounding the disclosure, should reasonably be understood to be confidential. The receiving party shall use the confidential information solely for the purpose of performing its obligations under this agreement and shall not disclose such confidential information to any third party without the prior written consent of the disclosing party, except to its employees, agents, and subcontractors who have a need to know such confidential information for the purpose of performing its obligations under this agreement and who are bound by confidentiality obligations at least as protective as those contained herein. The receiving party shall take all reasonable steps to protect the confidentiality of the confidential information, including but not limited to, implementing and maintaining appropriate administrative, technical, and physical safeguards to prevent unauthorized access to or disclosure of the confidential information. This confidentiality obligation shall survive the termination or expiration of this agreement for a period of three (3) years.
  
      8. Indemnification.
         Developer agrees to indemnify, defend, and hold harmless Client and its officers, directors, employees, and agents from any and all claims, damages, and expenses (including reasonable attorney's fees) arising out of or in connection with Developer's breach of any of its representations or warranties under this Agreement.
  
      9. Limitation of Liability.
         In no event shall Developer be liable for any consequential, special, indirect, or punitive damages arising out of or in connection with this Agreement, even if Developer has been advised of the possibility of such damages. Developer's total liability to Client under this Agreement shall not exceed the Purchase Price.
  
      10. Digital Assets.
          Client acknowledges and agrees that it is solely responsible for providing Developer with any digital assets or information necessary for the development of the Website, including but not limited to logos, pictures, and text.
  
      11. Publicity.
          Developer is free to use the Website in its professional portfolio after the Website has been made public. Developer does not require any credit or attribution specified on the Website.
  
      12. Force Majeure.
          Neither party shall be liable for any failure or delay in performance under this Agreement if such failure or delay is caused by acts of God, war, terrorism, civil unrest, embargoes, government regulations, strikes, labor disputes, illness, or other similar causes beyond the reasonable control of such party.
  
      13. Governing Law.
          This Agreement shall be governed by and construed in accordance with the laws of the Province of Ontario, Canada. Any dispute arising out of or relating to this Agreement shall be subject to the exclusive jurisdiction of the courts of the Province of Ontario, Canada.
  
      14. Dispute Resolution:
          Any dispute, claim, or controversy arising out of or relating to this agreement, including but not limited to, the breach, termination, enforcement, interpretation, or validity thereof, shall be resolved through good faith negotiations between the parties. If the parties are unable to resolve the dispute through negotiations within thirty (30) days, either party may request mediation. The parties shall select a mutually agreeable mediator and shall share equally in the costs of mediation. If mediation is unsuccessful, either party may initiate arbitration by filing a written demand for arbitration with the Canadian Arbitration Association in accordance with its rules and procedures. The arbitration shall take place in the province of Ontario, Canada and shall be conducted by a single arbitrator appointed in accordance with the Canadian Arbitration Association's rules. The decision of the arbitrator shall be final and binding on the parties, and may be entered and enforced in any court of competent jurisdiction. The prevailing party in any arbitration or litigation arising out of this agreement shall be entitled to recover its reasonable attorneys' fees and costs incurred in connection with such proceeding. This dispute resolution clause does not prevent either party from seeking injunctive relief to prevent irreparable harm pending the outcome of any dispute resolution process.
  
      15. Entire Agreement.
          This Agreement constitutes the entire agreement between the parties and supersedes all prior or contemporaneous negotiations, understandings, and agreements, whether written or oral, between the parties with respect to the subject matter hereof.
  
      16. Amendments.
          This agreement may not be modified, amended, or supplemented except in writing signed by both parties. Any attempt to modify, amend, or supplement this agreement except as expressly provided herein shall be null and void. Notwithstanding the foregoing, either party may request changes to this agreement, provided that such changes shall be in writing and shall identify the specific provisions to be modified, the reasons for such modifications, and the proposed changes. Upon receipt of such a request, the parties shall use their best efforts to negotiate a mutually acceptable resolution. Any modification or amendment to this agreement shall be effective only if it is in writing and signed by both parties.
  
      17. Counterparts.
          This agreement may be executed in counterparts, each of which shall be deemed an original, but all of which together shall constitute one and the same instrument. Facsimile, electronic, and scanned copies of signatures shall be deemed equivalent to original signatures for purposes of this agreement. This agreement may be executed and delivered by facsimile, electronic mail, or other electronic means, and such execution and delivery shall be deemed valid and binding upon the parties hereto as if an original executed and delivered document.
  
      18. Termination:
          Either party may terminate this agreement upon written notice to the other party if: a) The other party breaches any material term or condition of this agreement and fails to cure such breach within thirty (30) days of written notice specifying the breach; or b) The other party becomes insolvent or makes an assignment for the benefit of creditors, or if any proceeding under any bankruptcy or insolvency laws is commenced by or against the other party. Upon termination of this agreement, the developer shall provide the client with all necessary passwords, access codes, and related information regarding the website. The client shall be responsible for any fees or expenses incurred by the developer up to the date of termination. All provisions of this agreement that by their nature should survive termination, shall survive, including but not limited to, ownership provisions, warranty disclaimers, indemnity and limitations of liability.`,
    },
  ];

  let y = 50;

  // Loop through agreement sections and add them to the PDF
  agreementSections.forEach((section, index) => {
    doc.font("Helvetica-Bold");
    doc.fontSize(16);
    doc.text(section.title, 50, y, { align: "center" });
    y += 20;

    doc.font("Helvetica");
    const contentLines = section.content.split("\n");
    contentLines.forEach((line) => {
      if (line.trim() !== "") {
        // Check if it's a bullet point line
        if (/^\d/.test(line.trim())) {
          doc.text(line.trim(), { align: "center" });
        } else {
          doc.text(line.trim(), { align: "center" });
        }
        y += 15;
      }
    });

    if (index < agreementSections.length - 1) {
      y += 20; // Add spacing between sections
    }
  });

  doc.end();

  output.on("finish", () => {
    generatePagesLabel(9);
    const pdfDoc = new Recipe("web_development_contract.pdf", "output.pdf");

    pdfDoc.overlay("temp_page_numbers.pdf", 0, 0).endPDF();
    console.log("PDF generated successfully.");
  });

  output.on("error", (err) => {
    console.error("Error generating PDF:", err);
  });
}

function generatePagesLabel(pages: number) {
  const tempPageNumbersPDF = "temp_page_numbers.pdf";

  // Create a temporary PDF for page numbers
  const tempOutput = fs.createWriteStream(tempPageNumbersPDF);
  const tempDoc = new pdfkit();

  tempDoc.pipe(tempOutput);

  // Add page numbers to the temporary PDF
  tempDoc.fontSize(10);
  tempDoc.font("Helvetica");
  tempDoc.fillColor("gray");

  for (let currentPage = 1; currentPage <= pages; currentPage++) {
    tempDoc.text(`Page ${currentPage}/${pages}`, 50, tempDoc.page.height - 20);
  }

  tempDoc.end();
}
