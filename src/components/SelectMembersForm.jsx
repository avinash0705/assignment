import { useEffect, useState } from "react";
import { useFormContext } from "../Context";
import CustomToggleButton from "./Common/CustomToggleButton";
import "../styles/_selectMembersForm.css";
import { fetchMembers } from "../xhr";

export function SelectMembersForm({ onPrev, onSubmit }) {
    const { formData, dataset, updateFormData, updateDataset } = useFormContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchMembersData = async () => {
        try {
            setLoading(true);
            const response = await fetchMembers();
            setMembers(response.data);
            updateDataset({ ...dataset, members: response.data });
            setLoading(false);
        } catch (error) {
            console.error("Error fetching members:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        const membersList = formData.members.length ? formData.members : dataset.members.length ? dataset.members : [] ;

        if (membersList.length === 0) {
            fetchMembersData();
        } else {
            setMembers(membersList);
        }
    }, []);

    const handleMemberChange = (email) => {
        const updatedMembers = members.map(member =>
            member.email === email ? { ...member, selected: !member.selected } : member
        );
        setMembers(updatedMembers);
        updateFormData({ members: updatedMembers });
    };

    const filteredMembers = members.filter(member =>
        member.user.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div id="selectMembersForm" className="form-container">
            <div className="title-wrapper">
                <h2 className="form-heading">Would you like to add anyone to the new group now?</h2>
                <span className="help-text">You can skip this and add members later if you wish</span>
                <div className="search-bar">
                    <span className="search-ico" />
                    <input
                        id="structureName"
                        maxLength={100}
                        className="input-container"
                        placeholder="Search"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="count">{members.length} Members</span>
                </div>
            </div>
            <div className="list-container">
                {filteredMembers.map(member => (
                    <div key={member.email} className="list-item">
                        <CustomToggleButton
                            id={`member-${member.email}`}
                            checked={member.selected || false}
                            onChange={() => handleMemberChange(member.email)}
                            content={
                                <>
                                    <div className="member-details">
                                        <span className="member-user">{member.user}</span>
                                        <span className="member-info">{`${member.email} • ${member.organisation}`}</span>
                                    </div>
                                </>
                            }
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
