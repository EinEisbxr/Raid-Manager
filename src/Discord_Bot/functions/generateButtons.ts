import { ButtonStyle } from "discord-api-types/v9";

export async function generatePageButtons(createdRecord: any) {
    const buttons = [];
    buttons.push({
        label: "Previous",
        type: 2,
        style: ButtonStyle.Primary,
        custom_id: "PB-P-" + createdRecord.id, // Use the database ID here
    });
    buttons.push({
        label: "Next",
        type: 2,
        style: ButtonStyle.Primary,
        custom_id: "PB-N-" + createdRecord.id, // Use the database ID here
    });

    return buttons;
}
