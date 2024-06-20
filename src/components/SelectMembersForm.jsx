import { useEffect, useState } from "react";
import { useFormContext } from "../Context";
import CustomToggleButton from "./Common/CustomToggleButton";
import "../styles/_selectMembersForm.css";
export function SelectMembersForm ({ onPrev, onSubmit }) {
    const { formData, updateFormData } = useFormContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const fetchMembers = () => {
            setLoading(true);
            // const response = await fetch('/api/members');
            // const data = await response.json();
            const data = [
                { "user": "Ben Stockton", "email": "ben@dealsplus.io", "organisation": "Dealsplus"},
                { "user": "Sai Padala", "email": "sai@dealsplus.io", "organisation": "Dealsplus"},
                { "user": "Matt Wallis", "email": "matt@dealsplus.io", "organisation": "Phoneix"},
                { "user": "Ben Stockton", "email": "be@dealsplus.io", "organisation": "Dealsplus"},
                { "user": "Sai Padala", "email": "si@dealsplus.io", "organisation": "Dealsplus"},
                { "user": "Matt Wallis", "email": "mtt@dealsplus.io", "organisation": "Phoneix"},
                { "user": "Ben Stockton", "email": "b@dealsplus.io", "organisation": "Dealsplus"},
                { "user": "Sai Padala", "email": "s@dealsplus.io", "organisation": "Dealsplus"},
                { "user": "Matt Wallis", "email": "matt@dealsplus.io", "organisation": "Phoneix"},
         
            ];
            setMembers(data);
            setLoading(false);
        };

        if (formData.members.length === 0) {
            fetchMembers();
        } else {
            setMembers(formData.members);
        }
    }, [formData.members]);
    



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


    return <div id="selectMembersForm" className="form-container">

        <div className="title-wrapper">
            <h2 className="form-heading">Would you like to add anyone to the new group now? </h2>
            <span className="help-text">You can skip this and add members later if you wish</span>
            <div className="search-bar">
                <span className="search-ico"/>
                <input id="structureName" maxLength={100} className="input-container" placeholder="Search" onChange={(e) => setSearchTerm(e.target.value)}></input>
                <span className="count">{members.length} Members</span>
            </div>
        </div>

        <div className="list-container">
                {
                    filteredMembers.map(member => <div key={member.email} className="list-item">
                            <CustomToggleButton
                                id={`member-${member.email}`}
                                checked={member.selected || false}
                                onChange={() => handleMemberChange(member.email)}
                                content={(
                                    <>
                                        <div className="member-details">
                                            <span className="member-user">{member.user}</span>
                                            <span className="member-info">{`${member.email} • ${member.organisation}`}</span>
                                        </div>
                                    </>
                                )}
                            />
                        </div>
                    )
                }
            </div>
    </div>
}