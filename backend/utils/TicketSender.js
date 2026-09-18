const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const { AUTH_MAIL_PASS, AUTH_MAIL_USER } = require("../constants");
const { User } = require("../models/user.model");

/**
 * Function to create a professional booking confirmation PDF
 * @param {Object} data - The booking and traveller data
 * @param {string} bookingId - Unique booking reference ID
 * @returns {Promise<Buffer>} - Resolves with the generated PDF as a Buffer
 */
const createPDF = async (data, bookingId) => {
  return new Promise((resolve, reject) => {
    try {
      // Create A4 document with balanced margins
      const doc = new PDFDocument({
        size: "A4",
        margins: { top: 30, bottom: 18, left: 36, right: 36 },
        bufferPages: true,
      });

      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;
      const contentWidth = pageWidth - 72; // 595.28 - 72 = 523.28 pt
      const leftX = 36;
      const rightX = leftX + contentWidth;

      // Professional Color Palette
      const colors = {
        primary: "#0F172A", // Deep Navy / Slate 900
        secondary: "#1E293B", // Slate 800
        accent: "#0284C7", // Sky 600
        accentLight: "#F0F9FF", // Sky 50
        accentBorder: "#BAE6FD", // Sky 200
        textDark: "#0F172A",
        textMuted: "#64748B", // Slate 500
        textBody: "#334155", // Slate 700
        border: "#CBD5E1", // Slate 300
        cardBg: "#F8FAFC", // Slate 50
        success: "#059669", // Emerald 600
        successBg: "#ECFDF5", // Emerald 50
        successBorder: "#A7F3D0",
        white: "#FFFFFF",
      };

      // Assets paths (safe path resolution)
      const logoPath = path.join(__dirname, "../assets/logo.png");
      const paidStampPath = path.join(__dirname, "../assets/paid.png");

      let currentY = 30;

      // =========================================================================
      // 1. TOP BRANDING BAR & HEADER
      // =========================================================================
      doc.rect(leftX, currentY, contentWidth, 3).fill(colors.accent);
      currentY += 10;

      const headerStartY = currentY;

      // Brand Logo / Title
      let logoRendered = false;
      if (fs.existsSync(logoPath)) {
        try {
          doc.image(logoPath, leftX, currentY, { width: 95, height: 45 });
          logoRendered = true;
        } catch (e) {
          logoRendered = false;
        }
      }

      if (!logoRendered) {
        doc
          .font("Helvetica-Bold")
          .fontSize(22)
          .fillColor(colors.accent)
          .text("VOYA", leftX, currentY + 4);
        doc
          .font("Helvetica")
          .fontSize(9)
          .fillColor(colors.textMuted)
          .text("TRAVEL BOOKINGS", leftX, currentY + 28);
      }

      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor(colors.textMuted)
        .text("Your journey begins with confidence", leftX, currentY + 44);

      // Right Header: Confirmation Title & Status
      const rightColX = rightX - 220;
      doc
        .font("Helvetica-Bold")
        .fontSize(14)
        .fillColor(colors.primary)
        .text("BOOKING CONFIRMATION", rightColX, headerStartY + 2, {
          width: 220,
          align: "right",
        });

      // Status Pill
      const pillWidth = 110;
      const pillHeight = 16;
      const pillX = rightX - pillWidth;
      const pillY = headerStartY + 20;

      doc
        .roundedRect(pillX, pillY, pillWidth, pillHeight, 3)
        .fillAndStroke(colors.successBg, colors.successBorder);

      doc
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .fillColor(colors.success)
        .text("CONFIRMED & PAID", pillX, pillY + 4, {
          width: pillWidth,
          align: "center",
        });

      // Booking ID & Issue Date
      const displayId = String(bookingId || "VOYA-BK-00000").toUpperCase();
      const issueDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor(colors.textMuted)
        .text(`Booking ID:  ${displayId}`, rightColX, pillY + 22, {
          width: 220,
          align: "right",
        });

      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor(colors.textMuted)
        .text(`Issued:  ${issueDate}`, rightColX, pillY + 34, {
          width: 220,
          align: "right",
        });

      currentY = headerStartY + 62;

      // Divider line
      doc
        .moveTo(leftX, currentY)
        .lineTo(rightX, currentY)
        .strokeColor(colors.border)
        .lineWidth(0.75)
        .stroke();

      currentY += 8;

      // =========================================================================
      // 2. QUICK OVERVIEW METRIC CARDS (4-Column Strip)
      // =========================================================================
      const destination = data.holiday?.["Holiday Place"] || "N/A";
      const flightName = data.holiday?.Flight || "N/A";
      const hotelName = data.holiday?.Hotel || "N/A";

      // Cap tickets at max 5
      const maxTickets = 5;
      let rawCount = 1;
      if (data.ticketCount) {
        rawCount = Number(data.ticketCount);
      } else if (data.payment?.["Number of Travellers"]) {
        rawCount = parseInt(data.payment["Number of Travellers"], 10);
      }
      const ticketCount = Math.min(maxTickets, Math.max(1, isNaN(rawCount) ? 1 : rawCount));

      const metrics = [
        { label: "DESTINATION", val: destination },
        { label: "FLIGHT / CARRIER", val: flightName },
        { label: "ACCOMMODATION", val: hotelName },
        { label: "TICKETS / PASSENGERS", val: `${ticketCount} Traveller${ticketCount > 1 ? "s" : ""}` },
      ];

      const gap = 8;
      const cardWidth = (contentWidth - gap * 3) / 4;
      const cardHeight = 36;

      metrics.forEach((m, idx) => {
        const mx = leftX + idx * (cardWidth + gap);
        doc
          .roundedRect(mx, currentY, cardWidth, cardHeight, 4)
          .fillAndStroke(colors.cardBg, colors.border);

        doc.rect(mx, currentY + 5, 2.5, cardHeight - 10).fill(colors.accent);

        doc
          .font("Helvetica-Bold")
          .fontSize(6.5)
          .fillColor(colors.textMuted)
          .text(m.label, mx + 7, currentY + 6, { width: cardWidth - 12, ellipsis: true });

        doc
          .font("Helvetica-Bold")
          .fontSize(8.5)
          .fillColor(colors.textDark)
          .text(m.val, mx + 7, currentY + 18, { width: cardWidth - 12, ellipsis: true });
      });

      currentY += cardHeight + 12;

      // =========================================================================
      // HELPER: SECTION HEADER
      // =========================================================================
      const drawSectionHeader = (title, badgeText = null) => {
        doc.rect(leftX, currentY + 1, 3, 11).fill(colors.accent);
        doc
          .font("Helvetica-Bold")
          .fontSize(9.5)
          .fillColor(colors.secondary)
          .text(title.toUpperCase(), leftX + 8, currentY + 2);

        if (badgeText) {
          const bw = 95;
          const bx = rightX - bw;
          doc
            .roundedRect(bx, currentY + 1, bw, 13, 2)
            .fillAndStroke(colors.cardBg, colors.border);
          doc
            .font("Helvetica-Bold")
            .fontSize(6.5)
            .fillColor(colors.textMuted)
            .text(badgeText, bx, currentY + 3.5, { width: bw, align: "center", lineBreak: false });
        }
        currentY += 18;
      };

      // =========================================================================
      // 3. ITINERARY & RESERVATIONS CARD
      // =========================================================================
      drawSectionHeader("Itinerary & Schedule Details");

      const itinHeight = 58;
      doc
        .roundedRect(leftX, currentY, contentWidth, itinHeight, 4)
        .fillAndStroke(colors.white, colors.border);

      const col1Width = contentWidth * 0.48;
      const col2X = leftX + col1Width + 16;
      const col2Width = contentWidth - col1Width - 24;

      // Left Column: Holiday Destination & Hotel
      doc
        .font("Helvetica-Bold")
        .fontSize(7)
        .fillColor(colors.textMuted)
        .text("HOLIDAY DESTINATION", leftX + 10, currentY + 8);
      doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor(colors.textDark)
        .text(destination, leftX + 10, currentY + 18, { width: col1Width - 14, ellipsis: true });

      doc
        .font("Helvetica-Bold")
        .fontSize(7)
        .fillColor(colors.textMuted)
        .text("HOTEL RESERVATION", leftX + 10, currentY + 32);
      doc
        .font("Helvetica")
        .fontSize(8.5)
        .fillColor(colors.textBody)
        .text(hotelName, leftX + 10, currentY + 42, { width: col1Width - 14, ellipsis: true });

      // Vertical divider
      doc
        .moveTo(leftX + col1Width + 6, currentY + 6)
        .lineTo(leftX + col1Width + 6, currentY + itinHeight - 6)
        .strokeColor(colors.border)
        .lineWidth(0.5)
        .stroke();

      // Right Column: Flight, Departure, Arrival
      doc
        .font("Helvetica-Bold")
        .fontSize(7)
        .fillColor(colors.textMuted)
        .text("FLIGHT SCHEDULE", col2X, currentY + 8);

      const depTime = data.holiday?.["Departure Time"] || "Scheduled";
      const arrTime = data.holiday?.["Arrival Time"] || "Scheduled";

      doc
        .font("Helvetica-Bold")
        .fontSize(8.5)
        .fillColor(colors.textDark)
        .text(flightName, col2X, currentY + 18, { width: col2Width, ellipsis: true });

      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor(colors.textBody)
        .text(`Departs: ${depTime}`, col2X, currentY + 31, { width: col2Width, ellipsis: true });

      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor(colors.textBody)
        .text(`Arrives: ${arrTime}`, col2X, currentY + 43, { width: col2Width, ellipsis: true });

      currentY += itinHeight + 12;

      // =========================================================================
      // 4. PASSENGER INFORMATION TABLE (Capped at max 5)
      // =========================================================================
      drawSectionHeader("Passenger Details", `Max 5 Tickets (${ticketCount} booked)`);

      const columns = [
        { key: "seat", label: "#", width: 26, align: "center" },
        { key: "name", label: "PASSENGER NAME", width: 138, align: "left" },
        { key: "demographics", label: "AGE / GENDER", width: 78, align: "left" },
        { key: "id", label: "AADHAAR NUMBER", width: 94, align: "left" },
        { key: "address", label: "ADDRESS", width: 187.28, align: "left" },
      ];

      // Table Header
      const thHeight = 18;
      doc.rect(leftX, currentY, contentWidth, thHeight).fill(colors.secondary);

      let colX = leftX;
      columns.forEach((col) => {
        const textX = col.align === "center" ? colX : colX + 6;
        doc
          .font("Helvetica-Bold")
          .fontSize(7)
          .fillColor(colors.white)
          .text(col.label, textX, currentY + 5, {
            width: col.align === "center" ? col.width : col.width - 12,
            align: col.align,
          });
        colX += col.width;
      });

      currentY += thHeight;

      // Prepare Passenger Rows (Max 5)
      const primaryName = data.traveller?.["Traveller Name"] || "Primary Passenger";
      const primaryAge = data.traveller?.Age || "-";
      const primaryGender = data.traveller?.Gender || "-";
      const rawAadhaar = String(data.traveller?.["Aadhar Number"] || "N/A");
      const primaryAadhaar =
        rawAadhaar.length === 12
          ? `${rawAadhaar.slice(0, 4)} ${rawAadhaar.slice(4, 8)} ${rawAadhaar.slice(8, 12)}`
          : rawAadhaar;
      const primaryAddress = data.traveller?.Address || "N/A";

      const travellersList = [];

      if (Array.isArray(data.travellers) && data.travellers.length > 0) {
        data.travellers.slice(0, maxTickets).forEach((t, i) => {
          travellersList.push({
            seat: `0${i + 1}`,
            name: t.name || (i === 0 ? primaryName : `Co-Passenger ${i + 1}`),
            demographics: `${t.age || "-"} yrs / ${t.gender || "-"}`,
            id: t.adharNumber || (i === 0 ? primaryAadhaar : "Linked to Booking"),
            address: t.address || primaryAddress,
          });
        });
      } else {
        travellersList.push({
          seat: "01",
          name: `${primaryName} (Lead)`,
          demographics: `${primaryAge} yrs / ${primaryGender}`,
          id: primaryAadhaar,
          address: primaryAddress,
        });

        for (let i = 2; i <= ticketCount; i++) {
          travellersList.push({
            seat: `0${i}`,
            name: `Co-Traveller ${i} (Guest of ${primaryName.split(" ")[0]})`,
            demographics: `-`,
            id: `Linked to Ticket #01`,
            address: `Same as primary passenger`,
          });
        }
      }

      // Draw rows
      travellersList.forEach((traveller, rIdx) => {
        const textOptions = { width: columns[4].width - 12, align: "left" };
        doc.font("Helvetica").fontSize(7.5);
        const addressHeight = doc.heightOfString(traveller.address, textOptions);
        const rowH = Math.max(20, Math.ceil(addressHeight) + 8);

        const rowBg = rIdx % 2 === 0 ? colors.white : colors.cardBg;
        doc.rect(leftX, currentY, contentWidth, rowH).fillAndStroke(rowBg, colors.border);

        let rowColX = leftX;
        columns.forEach((col) => {
          let val = "";
          if (col.key === "seat") val = traveller.seat;
          else if (col.key === "name") val = traveller.name;
          else if (col.key === "demographics") val = traveller.demographics;
          else if (col.key === "id") val = traveller.id;
          else if (col.key === "address") val = traveller.address;

          const isBold = col.key === "name" && rIdx === 0;
          doc
            .font(isBold ? "Helvetica-Bold" : "Helvetica")
            .fontSize(7.5)
            .fillColor(colors.textDark);

          const textX = col.align === "center" ? rowColX : rowColX + 6;
          doc.text(val, textX, currentY + 5, {
            width: col.align === "center" ? col.width : col.width - 12,
            align: col.align,
          });

          rowColX += col.width;
        });

        currentY += rowH;
      });

      currentY += 12;

      // =========================================================================
      // 5. PAYMENT SUMMARY & INVOICE BREAKDOWN
      // =========================================================================
      drawSectionHeader("Payment Breakdown & Invoice");

      const invoiceTableWidth = contentWidth * 0.58;
      const totalBoxX = leftX + invoiceTableWidth + 12;
      const totalBoxWidth = contentWidth - invoiceTableWidth - 12;

      const payRows = [
        { item: "Holiday Base Package", rate: "Per Package", amt: data.payment?.["Trip Payment"] || "$ 0" },
        { item: "Hotel Accommodation", rate: "Per Stay", amt: data.payment?.["Hotel Payment"] || "$ 0" },
        { item: "Flight / Air Transport", rate: "Per Flight", amt: data.payment?.["Flight Payment"] || "$ 0" },
        { item: "Booked Travellers", rate: `${ticketCount} Seat(s)`, amt: "Included" },
      ];

      // Invoice Table
      const invThH = 16;
      doc.rect(leftX, currentY, invoiceTableWidth, invThH).fill(colors.cardBg);
      doc
        .font("Helvetica-Bold")
        .fontSize(7)
        .fillColor(colors.textMuted)
        .text("ITEM DESCRIPTION", leftX + 8, currentY + 4, { width: 140 })
        .text("BASIS", leftX + 155, currentY + 4, { width: 60 })
        .text("AMOUNT", leftX + 220, currentY + 4, { width: 75, align: "right" });

      let invY = currentY + invThH;
      payRows.forEach((row, i) => {
        const rh = 16;
        const bg = i % 2 === 0 ? colors.white : colors.cardBg;
        doc.rect(leftX, invY, invoiceTableWidth, rh).fillAndStroke(bg, colors.border);

        doc
          .font("Helvetica")
          .fontSize(7.5)
          .fillColor(colors.textDark)
          .text(row.item, leftX + 8, invY + 4, { width: 140, ellipsis: true })
          .font("Helvetica")
          .fillColor(colors.textMuted)
          .text(row.rate, leftX + 155, invY + 4, { width: 60, ellipsis: true })
          .font("Helvetica-Bold")
          .fillColor(colors.textDark)
          .text(row.amt, leftX + 220, invY + 4, { width: 75, align: "right" });

        invY += rh;
      });

      // Right Box: Grand Total & Paid Badge
      const totalBoxHeight = invY - currentY;
      doc
        .roundedRect(totalBoxX, currentY, totalBoxWidth, totalBoxHeight, 4)
        .fillAndStroke(colors.secondary, colors.primary);

      doc
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .fillColor(colors.accentBorder)
        .text("TOTAL AMOUNT PAID", totalBoxX + 12, currentY + 10);

      const totalAmt = data.payment?.["Total Amount"] || "$ 0";
      doc
        .font("Helvetica-Bold")
        .fontSize(16)
        .fillColor(colors.white)
        .text(totalAmt, totalBoxX + 12, currentY + 23);

      doc
        .font("Helvetica")
        .fontSize(7)
        .fillColor(colors.accentBorder)
        .text("Status: Completed (Card / Stripe)", totalBoxX + 12, currentY + 46);

      // Paid Stamp image
      if (fs.existsSync(paidStampPath)) {
        try {
          const stampSize = 52;
          doc.image(
            paidStampPath,
            totalBoxX + totalBoxWidth - stampSize - 8,
            currentY + totalBoxHeight - stampSize - 8,
            { width: stampSize, height: stampSize }
          );
        } catch (e) {
          // Fallback if image fails
        }
      }

      currentY = Math.max(invY, currentY + totalBoxHeight) + 12;

      // =========================================================================
      // 6. IMPORTANT TRAVEL INFORMATION CALLOUT
      // =========================================================================
      const calloutH = 46;
      doc
        .roundedRect(leftX, currentY, contentWidth, calloutH, 4)
        .fillAndStroke(colors.accentLight, colors.accentBorder);

      doc.rect(leftX, currentY, 3, calloutH).fill(colors.accent);

      doc
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .fillColor(colors.accent)
        .text("IMPORTANT TRAVEL INFORMATION", leftX + 10, currentY + 6);

      const notes = [
        "1. Photo ID: Carrying valid original Aadhaar / Passport is mandatory for all travellers at airport and hotel check-in.",
        "2. Airport Check-in: Please arrive at the flight departure terminal at least 2 hours prior to scheduled departure.",
        "3. Support: For changes, inquiries, or emergencies, visit voya-six-bay.vercel.app or reach out to support@voyawander.com.",
      ];

      let noteY = currentY + 18;
      notes.forEach((note) => {
        doc
          .font("Helvetica")
          .fontSize(6.5)
          .fillColor(colors.textBody)
          .text(note, leftX + 10, noteY, { width: contentWidth - 20 });
        noteY += 8.5;
      });

      // =========================================================================
      // 7. FOOTER
      // =========================================================================
      doc.page.margins.bottom = 0;
      const footerY = pageHeight - 32;

      doc
        .moveTo(leftX, footerY)
        .lineTo(rightX, footerY)
        .strokeColor(colors.border)
        .lineWidth(0.5)
        .stroke();

      doc
        .font("Helvetica")
        .fontSize(7)
        .fillColor(colors.textMuted)
        .text(
          "Voyawander Technologies Inc. • Automated Travel Confirmation System • This is a computer generated document.",
          leftX,
          footerY + 8,
          { width: contentWidth * 0.75, lineBreak: false }
        );

      doc
        .font("Helvetica")
        .fontSize(7)
        .fillColor(colors.textMuted)
        .text("Page 1 of 1", rightX - 80, footerY + 8, {
          width: 80,
          align: "right",
          lineBreak: false,
        });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Function to send tickets via email
 * @param {Object} payload - Contains userId and booking data
 */

const sendTickets = async (payload) => {
  const { userId, data, bookingId } = payload;

  // Fetch user email address from the database
  const user = await User.findById(userId);

  if (!user || !user.email) {
    throw new Error("User not found or email missing");
  }

  const to = user.email; // Recipient email address
  const subject = `Your Holiday Details (Booking ID: ${bookingId})`;

  try {
    // Generate PDF from the data
    const pdfBuffer = await createPDF(data, bookingId);

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: AUTH_MAIL_USER,
        pass: AUTH_MAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: AUTH_MAIL_USER,
      to,
      subject,
      text: `Dear ${user.fullname},\n\nPlease find attached your holiday details. If you have any questions or need further assistance, feel free to contact us.\n\nImportant: Don't forget to carry Aadhaar card and passport for all travelers.\n\nBest regards,\nThe Voyawander Team`,

      attachments: [
        {
          filename: "HolidayDetails.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    // Send the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { sendTickets, createPDF };
